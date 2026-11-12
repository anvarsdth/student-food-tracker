import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAllHomes, createHome } from '@/lib/mongoService';

export async function GET() {
  try {
    await connectDB();
    const homes = await getAllHomes();
    return NextResponse.json({ homes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch host homes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      userId,
      hostName,
      phone,
      address,
      landmark,
      breakfastCapacity,
      lunchCapacity,
      dinnerCapacity,
      googleMapsUrl,
      notes,
      password,
    } = body;

    if (!userId || !hostName || !phone || !address || !landmark) {
      return NextResponse.json(
        { error: 'User ID, Host Name, Phone, Address, and Landmark are required' },
        { status: 400 }
      );
    }

    const newHome = await createHome({
      userId,
      hostName,
      phone,
      address,
      landmark,
      breakfastCapacity: Number(breakfastCapacity) || 4,
      lunchCapacity: Number(lunchCapacity) || 4,
      dinnerCapacity: Number(dinnerCapacity) || 4,
      googleMapsUrl,
      notes,
      password: password || 'password123',
    });

    return NextResponse.json({ home: newHome }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create host home' },
      { status: 500 }
    );
  }
}
