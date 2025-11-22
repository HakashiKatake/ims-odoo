import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Delivery from '@/models/Delivery';
import { requireAuth } from '@/lib/auth';
import { updateStock } from '@/lib/stock-manager';
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

    const [deliveries, total] = await Promise.all([
      Delivery.find(query)
        .populate('from')
        .populate('products.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Delivery.countDocuments(query),
    ]);

    return NextResponse.json({
      deliveries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch deliveries' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    await connectDB();

    const body = await request.json();
    const { contact, from, deliveryAddress, scheduleDate, products, responsible } = body;

    if (!contact || !from || !deliveryAddress || !products || products.length === 0 || !responsible) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const location = await Location.findById(from).populate('warehouse');
    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Generate reference
    const count = await Delivery.countDocuments();
    const reference = `${(location.warehouse as any).shortCode}/OUT/${String(count + 1).padStart(4, '0')}`;

    const delivery = await Delivery.create({
      reference,
      contact,
      from,
      to: 'customer',
      deliveryAddress,
      scheduleDate: scheduleDate || new Date(),
      status: 'draft',
      operationType: 'delivery',
      products: products.map((p: any) => ({
        product: p.product,
        quantity: p.quantity,
        deliveredQuantity: 0,
      })),
      responsible,
      createdBy: userId,
    });

    await delivery.populate('from');
    await delivery.populate('products.product');

    return NextResponse.json({ delivery }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating delivery:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create delivery' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
