import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAllBackupAssignments, createBackupAssignment, deleteBackupAssignment } from '@/lib/mongoService';
import { MealType } from '@/types';

export async function GET() {
  try {
    await connectDB();
    const backups = await getAllBackupAssignments();
    return NextResponse.json({ backups });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch backups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { studentId, originalHomeId, backupHomeId, date, mealType, reason } = body;

    if (!studentId || !originalHomeId || !backupHomeId || !date || !mealType) {
      return NextResponse.json(
        { error: 'studentId, originalHomeId, backupHomeId, date, and mealType are required' },
        { status: 400 }
      );
    }

    const backup = await createBackupAssignment({
      studentId,
      originalHomeId,
      backupHomeId,
      date,
      mealType: mealType as MealType,
      reason,
    });

    return NextResponse.json({ backup }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create backup assignment' },
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
      return NextResponse.json({ error: 'Backup ID is required' }, { status: 400 });
    }

    const success = await deleteBackupAssignment(id);
    if (!success) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete backup assignment' },
      { status: 500 }
    );
  }
}
