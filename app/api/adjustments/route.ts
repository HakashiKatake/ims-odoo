import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Adjustment from '@/models/Adjustment';
import { requireAuth } from '@/lib/auth';
import Location from '@/models/Location';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [adjustments, total] = await Promise.all([
      Adjustment.find(query)
        .populate({
          path: 'location',
          populate: { path: 'warehouse' }
        })
        .populate('products.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Adjustment.countDocuments(query),
    ]);

    return NextResponse.json({
      adjustments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching adjustments:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch adjustments' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    await connectDB();

    const body = await request.json();
    const { location, reason, products, responsible, notes } = body;

    if (!location || !reason || !products || products.length === 0 || !responsible) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const locationDoc = await Location.findById(location).populate('warehouse');
    if (!locationDoc) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Generate reference
    const count = await Adjustment.countDocuments();
    const reference = `${(locationDoc.warehouse as any).shortCode}/ADJ/${String(count + 1).padStart(4, '0')}`;

    const adjustment = await Adjustment.create({
      reference,
      location,
      reason,
      status: 'draft',
      operationType: 'adjustment',
      products: products.map((p: any) => ({
        product: p.product,
        quantityChange: p.quantityChange,
        adjustedQuantity: 0,
      })),
      responsible,
      notes: notes || '',
      createdBy: userId,
    });

    await adjustment.populate({
      path: 'location',
      populate: { path: 'warehouse' }
    });
    await adjustment.populate('products.product');

    return NextResponse.json({ adjustment }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating adjustment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create adjustment' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
