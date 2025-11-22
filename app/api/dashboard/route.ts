import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Stock from '@/models/Stock';
import Receipt from '@/models/Receipt';
import Delivery from '@/models/Delivery';
import Transfer from '@/models/Transfer';
import { requireAuth } from '@/lib/auth';
import { getLowStockProducts } from '@/lib/stock-manager';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouse');

    // Total products in stock
    const stockQuery: any = {};
    if (warehouseId) {
      stockQuery.warehouse = warehouseId;
    }

    const [
      totalProducts,
      lowStockItems,
      outOfStockItems,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers,
      recentActivity,
    ] = await Promise.all([
      Stock.distinct('product', { ...stockQuery, onHand: { $gt: 0 } }),
      getLowStockProducts(warehouseId || undefined),
      Stock.find({ ...stockQuery, onHand: 0 }).distinct('product'),
      Receipt.countDocuments({ status: { $in: ['draft', 'waiting', 'ready'] } }),
      Delivery.countDocuments({ status: { $in: ['draft', 'waiting', 'ready'] } }),
      Transfer.countDocuments({ status: { $in: ['draft', 'waiting', 'ready'] } }),
      Receipt.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('to')
        .populate('products.product')
        .lean(),
    ]);

    const kpis = {
      totalProductsInStock: totalProducts.length,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      pendingReceipts,
      pendingDeliveries,
      internalTransfersScheduled: pendingTransfers,
    };

    return NextResponse.json({
      kpis,
      recentActivity,
      lowStockProducts: lowStockItems.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
