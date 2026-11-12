import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getStudentDailySchedule, getTodayString } from '@/lib/mongoService';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date') || getTodayString();

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    const schedule = await getStudentDailySchedule(studentId, date);
    if (!schedule) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ schedule });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch student schedule' },
      { status: 500 }
    );
  }
}
