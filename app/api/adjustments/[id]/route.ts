import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Adjustment from '@/models/Adjustment';
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

    const adjustment = await Adjustment.findById(id)
      .populate({
        path: 'location',
        populate: { path: 'warehouse' }
      })
      .populate('products.product');

    if (!adjustment) {
      return NextResponse.json(
        { error: 'Adjustment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ adjustment });
  } catch (error: any) {
    console.error('Error fetching adjustment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch adjustment' },
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

    const adjustment = await Adjustment.findById(id)
      .populate({
        path: 'location',
        populate: { path: 'warehouse' }
      })
      .populate('products.product');

    if (!adjustment) {
      return NextResponse.json(
        { error: 'Adjustment not found' },
        { status: 404 }
      );
    }

    // Validate status transitions
    if (status === 'ready' && adjustment.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Can only mark waiting adjustments as ready' },
        { status: 400 }
      );
    }

    if (status === 'done' && adjustment.status !== 'ready') {
      return NextResponse.json(
        { error: 'Can only validate ready adjustments' },
        { status: 400 }
      );
    }

    // If validating adjustment, update stock
    if (status === 'done') {
      for (const productLine of adjustment.products) {
        await updateStock({
          productId: productLine.product._id.toString(),
          locationId: adjustment.location._id.toString(),
          quantity: Math.abs(productLine.quantityChange),
          movementType: 'adjustment',
          reference: adjustment.reference,
          documentId: adjustment._id.toString(),
          responsible: adjustment.responsible,
        });

        productLine.adjustedQuantity = productLine.quantityChange;
      }
    }

    adjustment.status = status;
    await adjustment.save();

    return NextResponse.json({ adjustment });
  } catch (error: any) {
    console.error('Error updating adjustment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update adjustment' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();

    const { id } = await params;

    const adjustment = await Adjustment.findById(id);

    if (!adjustment) {
      return NextResponse.json(
        { error: 'Adjustment not found' },
        { status: 404 }
      );
    }

    if (adjustment.status === 'done') {
      return NextResponse.json(
        { error: 'Cannot delete validated adjustments' },
        { status: 400 }
      );
    }

    await adjustment.deleteOne();

    return NextResponse.json({ message: 'Adjustment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting adjustment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete adjustment' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
