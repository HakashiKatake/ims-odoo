import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Warehouse from '@/models/Warehouse';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const warehouses = await Warehouse.find().sort({ createdAt: -1 });

    return NextResponse.json({ warehouses });
  } catch (error: any) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch warehouses' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const body = await request.json();
    const { name, shortCode, address } = body;

    if (!name || !shortCode || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingWarehouse = await Warehouse.findOne({ 
      shortCode: shortCode.toUpperCase() 
    });
    
    if (existingWarehouse) {
      return NextResponse.json(
        { error: 'Warehouse with this code already exists' },
        { status: 400 }
      );
    }

    const warehouse = await Warehouse.create({
      name,
      shortCode: shortCode.toUpperCase(),
      address,
    });

    return NextResponse.json({ warehouse }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create warehouse' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
