import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';

export async function POST() {
  try {
    resetDatabase();
    return NextResponse.json({ success: true, message: 'Database reset to initial seed data' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to reset database' }, { status: 500 });
  }
}

