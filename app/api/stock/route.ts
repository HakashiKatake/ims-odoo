import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stock from '@/models/Stock';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouse');

    const query: any = {};
    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    const stocks = await Stock.find(query)
      .populate('product')
      .populate('location')
      .populate('warehouse')
      .lean();

    // Group by product
    const groupedStock = stocks.reduce((acc: any, stock: any) => {
      const productId = stock.product._id.toString();
      
      if (!acc[productId]) {
        acc[productId] = {
          product: {
            _id: stock.product._id,
            name: stock.product.name,
            sku: stock.product.sku,
            category: stock.product.category,
            minStockLevel: stock.product.minStockLevel,
          },
          totalOnHand: 0,
          totalFreeToUse: 0,
          locations: [],
        };
      }

      acc[productId].totalOnHand += stock.onHand;
      acc[productId].totalFreeToUse += stock.freeToUse;
      acc[productId].locations.push({
        warehouse: stock.warehouse.name,
        location: stock.location.name,
        onHand: stock.onHand,
        freeToUse: stock.freeToUse,
      });

      return acc;
    }, {});

    const stockArray = Object.values(groupedStock);

    return NextResponse.json({ stock: stockArray });
  } catch (error: any) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stock' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
