import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Stock from '@/models/Stock';
import Receipt from '@/models/Receipt';
import Delivery from '@/models/Delivery';
import Transfer from '@/models/Transfer';
import Adjustment from '@/models/Adjustment';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get date ranges for analytics
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Stock level trends (last 7 days)
    const stockTrends = await Stock.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalValue: { 
            $sum: { 
              $multiply: ['$quantity', '$product.perUnitCost'] 
            } 
          },
        },
      },
    ]);

    // Recent receipts (last 7 days)
    const recentReceipts = await Receipt.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          status: 'done',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          totalProducts: { $sum: { $size: '$products' } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent deliveries (last 7 days)
    const recentDeliveries = await Delivery.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          status: 'done',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          totalProducts: { $sum: { $size: '$products' } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top products by stock value
    const topProducts = await Stock.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$product',
          name: { $first: '$productInfo.name' },
          sku: { $first: '$productInfo.sku' },
          totalQuantity: { $sum: '$quantity' },
          unitCost: { $first: '$productInfo.perUnitCost' },
        },
      },
      {
        $addFields: {
          totalValue: { $multiply: ['$totalQuantity', '$unitCost'] },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 5 },
    ]);

    // Movement summary (last 30 days)
    const [receiptsCount, deliveriesCount, transfersCount, adjustmentsCount] = await Promise.all([
      Receipt.countDocuments({ createdAt: { $gte: last30Days } }),
      Delivery.countDocuments({ createdAt: { $gte: last30Days } }),
      Transfer.countDocuments({ createdAt: { $gte: last30Days } }),
      Adjustment.countDocuments({ createdAt: { $gte: last30Days } }),
    ]);

    // Low stock alerts
    const lowStockProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'stocks',
          localField: '_id',
          foreignField: 'product',
          as: 'stockInfo',
        },
      },
      {
        $addFields: {
          totalStock: { $sum: '$stockInfo.quantity' },
        },
      },
      {
        $match: {
          $expr: { $lt: ['$totalStock', '$minStockLevel'] },
        },
      },
      {
        $project: {
          name: 1,
          sku: 1,
          totalStock: 1,
          minStockLevel: 1,
        },
      },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      stockOverview: {
        totalQuantity: stockTrends[0]?.totalQuantity || 0,
        totalValue: stockTrends[0]?.totalValue || 0,
      },
      recentActivity: {
        receipts: recentReceipts,
        deliveries: recentDeliveries,
      },
      topProducts,
      movementSummary: {
        receipts: receiptsCount,
        deliveries: deliveriesCount,
        transfers: transfersCount,
        adjustments: adjustmentsCount,
      },
      lowStockAlerts: lowStockProducts,
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
