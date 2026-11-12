import { NextRequest, NextResponse } from 'next/server';
import { getAllMealAssignments, setMealAssignment, bulkUpdateAssignments } from '@/lib/db';
import { MealType } from '@/types';

export async function GET() {
  const assignments = getAllMealAssignments();
  return NextResponse.json({ assignments });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if bulk update
    if (body.bulk && Array.isArray(body.assignments)) {
      bulkUpdateAssignments(body.assignments);
      return NextResponse.json({ success: true, assignments: getAllMealAssignments() });
    }

    const { studentId, mealType, homeId } = body;
    if (!studentId || !mealType || !homeId) {
      return NextResponse.json(
        { error: 'studentId, mealType, and homeId are required' },
        { status: 400 }
      );
    }

    const assignment = setMealAssignment(studentId, mealType as MealType, homeId);
    return NextResponse.json({ assignment });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to set assignment' },
      { status: 500 }
    );
  }
}

