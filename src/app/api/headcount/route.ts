import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAllHomesDailySummary, getHomeDailySummary, getTodayString } from '@/lib/mongoService';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || getTodayString();
    const homeId = searchParams.get('homeId');

    if (homeId) {
      const summary = await getHomeDailySummary(homeId, date);
      if (!summary) {
        return NextResponse.json({ error: 'Home not found' }, { status: 404 });
      }
      return NextResponse.json({ summary });
    }

    const summaries = await getAllHomesDailySummary(date);
    return NextResponse.json({ date, summaries });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch headcount' },
      { status: 500 }
    );
  }
}
