import { NextRequest, NextResponse } from 'next/server';
import { getAllBackupAssignments, createBackupAssignment, deleteBackupAssignment } from '@/lib/db';
import { MealType } from '@/types';

export async function GET() {
  const backups = getAllBackupAssignments();
  return NextResponse.json({ backups });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, originalHomeId, backupHomeId, date, mealType, reason } = body;

    if (!studentId || !originalHomeId || !backupHomeId || !date || !mealType) {
      return NextResponse.json(
        { error: 'studentId, originalHomeId, backupHomeId, date, and mealType are required' },
        { status: 400 }
      );
    }

    const backup = createBackupAssignment({
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Backup ID is required' }, { status: 400 });
    }

    const success = deleteBackupAssignment(id);
    if (!success) {
      return NextResponse.json({ error: 'Backup assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete backup' },
      { status: 500 }
    );
  }
}

