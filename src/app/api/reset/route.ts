import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { resetDatabase } from '@/lib/mongoService';

export async function POST() {
  try {
    await connectDB();
    await resetDatabase();
    return NextResponse.json({ success: true, message: 'Database reset to initial seed data in MongoDB' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to reset database' }, { status: 500 });
  }
}
