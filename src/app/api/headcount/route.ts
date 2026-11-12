import { NextRequest, NextResponse } from 'next/server';
import { getAllHomesDailySummary, getHomeDailySummary, getTodayString } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || getTodayString();
  const homeId = searchParams.get('homeId');

  if (homeId) {
    const summary = getHomeDailySummary(homeId, date);
    if (!summary) {
      return NextResponse.json({ error: 'Home not found' }, { status: 404 });
    }
    return NextResponse.json({ summary });
  }

  const summaries = getAllHomesDailySummary(date);
  return NextResponse.json({ date, summaries });
}

