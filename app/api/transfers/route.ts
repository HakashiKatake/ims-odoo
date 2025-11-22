import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transfer from '@/models/Transfer';
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

    const [transfers, total] = await Promise.all([
      Transfer.find(query)
        .populate({
          path: 'from',
          populate: { path: 'warehouse' }
        })
        .populate({
          path: 'to',
          populate: { path: 'warehouse' }
        })
        .populate('products.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transfer.countDocuments(query),
    ]);

    return NextResponse.json({
      transfers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transfers' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    await connectDB();

    const body = await request.json();
    const { from, to, scheduleDate, products, responsible } = body;

    if (!from || !to || !products || products.length === 0 || !responsible) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json(
        { error: 'Source and destination locations must be different' },
        { status: 400 }
      );
    }

    const [fromLocation, toLocation] = await Promise.all([
      Location.findById(from).populate('warehouse'),
      Location.findById(to).populate('warehouse'),
    ]);

    if (!fromLocation || !toLocation) {
      return NextResponse.json(
        { error: 'Invalid location' },
        { status: 404 }
      );
    }

    // Generate reference
    const count = await Transfer.countDocuments();
    const reference = `${(fromLocation.warehouse as any).shortCode}/TRF/${String(count + 1).padStart(4, '0')}`;

    const transfer = await Transfer.create({
      reference,
      from,
      to,
      scheduleDate: scheduleDate || new Date(),
      status: 'draft',
      operationType: 'transfer',
      products: products.map((p: any) => ({
        product: p.product,
        quantity: p.quantity,
        transferredQuantity: 0,
      })),
      responsible,
      createdBy: userId,
    });

    await transfer.populate({
      path: 'from',
      populate: { path: 'warehouse' }
    });
    await transfer.populate({
      path: 'to',
      populate: { path: 'warehouse' }
    });
    await transfer.populate('products.product');

    return NextResponse.json({ transfer }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transfer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create transfer' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
