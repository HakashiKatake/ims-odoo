import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Delivery from '@/models/Delivery';
import { requireAuth } from '@/lib/auth';
import { updateStock } from '@/lib/stock-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();

    const { id } = await params;
    const delivery = await Delivery.findById(id)
      .populate('from')
      .populate('products.product');

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ delivery });
  } catch (error: any) {
    console.error('Error fetching delivery:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch delivery' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const delivery = await Delivery.findById(id)
      .populate('from')
      .populate('products.product');

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      );
    }

    // If changing to 'done', process stock updates
    if (status === 'done' && delivery.status === 'ready') {
      for (const line of delivery.products) {
        await updateStock({
          productId: line.product._id.toString(),
          locationId: delivery.from._id.toString(),
          quantity: line.quantity, // Stock manager handles direction based on movementType
          movementType: 'delivery',
          reference: delivery.reference,
          documentId: delivery._id.toString(),
          responsible: delivery.responsible,
          date: delivery.scheduleDate,
        });
      }
    }

    delivery.status = status;
    await delivery.save();

    return NextResponse.json({ delivery });
  } catch (error: any) {
    console.error('Error updating delivery:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update delivery' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
