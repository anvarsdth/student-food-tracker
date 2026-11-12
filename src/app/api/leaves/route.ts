import { NextRequest, NextResponse } from 'next/server';
import { getAllStudentLeaves, createStudentLeave, cancelStudentLeave } from '@/lib/db';
import { LeaveMealType } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  let leaves = getAllStudentLeaves();
  if (studentId) {
    leaves = leaves.filter((l) => l.studentId === studentId);
  }
  return NextResponse.json({ leaves });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, startDate, endDate, mealType, reason } = body;

    if (!studentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'studentId, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    const newLeave = createStudentLeave({
      studentId,
      startDate,
      endDate,
      mealType: (mealType as LeaveMealType) || 'all',
      reason,
    });

    return NextResponse.json({ leave: newLeave }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to submit leave' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Leave ID is required' }, { status: 400 });
    }

    const success = cancelStudentLeave(id);
    if (!success) {
      return NextResponse.json({ error: 'Leave not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to cancel leave' },
      { status: 500 }
    );
  }
}

