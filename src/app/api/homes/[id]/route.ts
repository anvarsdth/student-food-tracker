import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { updateHome, deleteHome } from '@/lib/mongoService';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await updateHome(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Home not found' }, { status: 404 });
    }
    return NextResponse.json({ home: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update home' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const success = await deleteHome(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Home not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete home' },
      { status: 500 }
    );
  }
}
