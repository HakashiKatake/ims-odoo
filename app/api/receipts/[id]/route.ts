import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Receipt from '@/models/Receipt';
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
    const receipt = await Receipt.findById(id)
      .populate('to')
      .populate('products.product');

    if (!receipt) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ receipt });
  } catch (error: any) {
    console.error('Error fetching receipt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch receipt' },
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

    const receipt = await Receipt.findById(id)
      .populate('to')
      .populate('products.product');

    if (!receipt) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      );
    }

    // If changing to 'done', process stock updates
    if (status === 'done' && receipt.status === 'ready') {
      for (const line of receipt.products) {
        await updateStock({
          productId: line.product._id.toString(),
          locationId: receipt.to._id.toString(),
          quantity: line.quantity,
          movementType: 'receipt',
          reference: receipt.reference,
          documentId: receipt._id.toString(),
          responsible: receipt.responsible,
          date: receipt.scheduleDate,
        });
      }
    }

    // Update status
    receipt.status = status;
    await receipt.save();

    return NextResponse.json({ receipt });
  } catch (error: any) {
    console.error('Error updating receipt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update receipt' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
