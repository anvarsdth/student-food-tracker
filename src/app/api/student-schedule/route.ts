import { NextRequest, NextResponse } from 'next/server';
import { getStudentDailySchedule, getTodayString } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const date = searchParams.get('date') || getTodayString();

  if (!studentId) {
    return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
  }

  const schedule = getStudentDailySchedule(studentId, date);
  if (!schedule) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json({ schedule });
}

