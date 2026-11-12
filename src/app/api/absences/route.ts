import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAllHomeAbsences, createHomeAbsence, deleteHomeAbsence } from '@/lib/mongoService';
import { LeaveMealType } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const homeId = searchParams.get('homeId');
    let absences = await getAllHomeAbsences();
    if (homeId) {
      absences = absences.filter((a) => a.homeId === homeId);
    }
    return NextResponse.json({ absences });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch absences' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { homeId, startDate, endDate, mealType, reason } = body;

    if (!homeId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'homeId, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    const newAbsence = await createHomeAbsence({
      homeId,
      startDate,
      endDate,
      mealType: (mealType as LeaveMealType) || 'all',
      reason,
    });

    return NextResponse.json({ absence: newAbsence }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to mark absence' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Absence ID is required' }, { status: 400 });
    }

    const success = await deleteHomeAbsence(id);
    if (!success) {
      return NextResponse.json({ error: 'Absence not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete absence' },
      { status: 500 }
    );
  }
}
