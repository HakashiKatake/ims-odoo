import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transfer from '@/models/Transfer';
import { requireAuth } from '@/lib/auth';
import { updateStock } from '@/lib/stock-manager';
import { generateReference } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();

    const { id } = await params;

    const transfer = await Transfer.findById(id)
      .populate({
        path: 'from',
        populate: { path: 'warehouse' }
      })
      .populate({
        path: 'to',
        populate: { path: 'warehouse' }
      })
      .populate('products.product');

    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ transfer });
  } catch (error: any) {
    console.error('Error fetching transfer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transfer' },
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

    const transfer = await Transfer.findById(id)
      .populate({
        path: 'from',
        populate: { path: 'warehouse' }
      })
      .populate({
        path: 'to',
        populate: { path: 'warehouse' }
      })
      .populate('products.product');

    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      );
    }

    // Validate status transitions
    if (status === 'ready' && transfer.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Can only mark waiting transfers as ready' },
        { status: 400 }
      );
    }

    if (status === 'done' && transfer.status !== 'ready') {
      return NextResponse.json(
        { error: 'Can only validate ready transfers' },
        { status: 400 }
      );
    }

    // If validating transfer, update stock
    if (status === 'done') {
      for (const productLine of transfer.products) {
        // Deduct from source location
        await updateStock({
          productId: productLine.product._id.toString(),
          locationId: transfer.from._id.toString(),
          quantity: productLine.quantity,
          movementType: 'transfer',
          reference: transfer.reference,
          documentId: transfer._id.toString(),
          responsible: transfer.responsible,
        });

        // Add to destination location
        await updateStock({
          productId: productLine.product._id.toString(),
          locationId: transfer.to._id.toString(),
          quantity: productLine.quantity,
          movementType: 'transfer',
          reference: transfer.reference,
          documentId: transfer._id.toString(),
          responsible: transfer.responsible,
        });

        productLine.transferredQuantity = productLine.quantity;
      }
    }

    transfer.status = status;
    await transfer.save();

    return NextResponse.json({ transfer });
  } catch (error: any) {
    console.error('Error updating transfer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update transfer' },
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

    const transfer = await Transfer.findById(id);

    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      );
    }

    if (transfer.status === 'done') {
      return NextResponse.json(
        { error: 'Cannot delete validated transfers' },
        { status: 400 }
      );
    }

    await transfer.deleteOne();

    return NextResponse.json({ message: 'Transfer deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting transfer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete transfer' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
