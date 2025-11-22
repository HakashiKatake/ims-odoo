import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import StockLedger from '@/models/StockLedger';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const product = searchParams.get('product');
    const location = searchParams.get('location');
    const movementType = searchParams.get('movementType');

    const filter: any = {};
    if (product) filter.product = product;
    if (location) filter.location = location;
    if (movementType) filter.movementType = movementType;

    const entries = await StockLedger.find(filter)
      .populate('product', 'name sku')
      .populate({
        path: 'location',
        select: 'name',
        populate: {
          path: 'warehouse',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ entries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes('Unauthorized') ? 401 : 500 });
  }
}
