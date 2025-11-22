import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Receipt from '@/models/Receipt';
import { requireAuth } from '@/lib/auth';
import { updateStock } from '@/lib/stock-manager';
import Location from '@/models/Location';
import { logActivity } from '@/lib/activity-logger';

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

    const [receipts, total] = await Promise.all([
      Receipt.find(query)
        .populate('to')
        .populate('products.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Receipt.countDocuments(query),
    ]);

    return NextResponse.json({
      receipts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch receipts' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    await connectDB();

    const body = await request.json();
    const { contact, to, scheduleDate, products, responsible } = body;

    if (!contact || !to || !products || products.length === 0 || !responsible) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const location = await Location.findById(to).populate('warehouse');
    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Generate reference
    const count = await Receipt.countDocuments();
    const reference = `${(location.warehouse as any).shortCode}/IN/${String(count + 1).padStart(4, '0')}`;

    const receipt = await Receipt.create({
      reference,
      contact,
      from: 'vendor',
      to,
      scheduleDate: scheduleDate || new Date(),
      status: 'draft',
      products: products.map((p: any) => ({
        product: p.product,
        quantity: p.quantity,
        receivedQuantity: 0,
      })),
      responsible,
      createdBy: userId,
    });

    await receipt.populate('to');
    await receipt.populate('products.product');

    // Log activity
    await logActivity({
      action: 'create',
      entityType: 'receipt',
      entityId: receipt._id.toString(),
      entityReference: receipt.reference,
      description: `Created receipt ${receipt.reference} with ${receipt.products.length} product(s) for ${contact}`,
    });

    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating receipt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create receipt' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
