import { NextRequest, NextResponse } from 'next/server';
import { getAllHomes, createHome } from '@/lib/db';

export async function GET() {
  const homes = getAllHomes();
  return NextResponse.json({ homes });
}

export async function POST(req: NextRequest) {
  try {
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

    const newHome = createHome({
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

