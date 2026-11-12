import { NextRequest, NextResponse } from 'next/server';
import { updateHome, deleteHome } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = updateHome(params.id, body);
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
    const success = deleteHome(params.id);
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

