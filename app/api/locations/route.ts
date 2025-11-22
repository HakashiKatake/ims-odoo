import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Location from '@/models/Location';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouse');

    const query = warehouseId ? { warehouse: warehouseId } : {};
    
    const locations = await Location.find(query)
      .populate('warehouse')
      .sort({ createdAt: -1 });

    return NextResponse.json({ locations });
  } catch (error: any) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch locations' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const body = await request.json();
    const { name, shortCode, warehouse } = body;

    if (!name || !shortCode || !warehouse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingLocation = await Location.findOne({ 
      warehouse,
      shortCode: shortCode.toUpperCase(),
    });
    
    if (existingLocation) {
      return NextResponse.json(
        { error: 'Location with this code already exists in this warehouse' },
        { status: 400 }
      );
    }

    const location = await Location.create({
      name,
      shortCode: shortCode.toUpperCase(),
      warehouse,
    });

    await location.populate('warehouse');

    return NextResponse.json({ location }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create location' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
