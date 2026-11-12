export type Role = 'admin' | 'student' | 'host';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type LeaveMealType = 'all' | 'breakfast' | 'lunch' | 'dinner';

export interface User {
  id: string;
  userId: string; // e.g. ADM01, STU101, HOM201
  password: string;
  role: Role;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Student {
  id: string;
  userId: string; // matches User.userId
  name: string;
  phone: string;
  roomNo: string;
  hostelBlock?: string;
  emergencyContact?: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface Home {
  id: string;
  userId: string; // matches User.userId
  hostName: string;
  phone: string;
  address: string;
  landmark: string;
  breakfastCapacity: number;
  lunchCapacity: number;
  dinnerCapacity: number;
  googleMapsUrl?: string;
  notes?: string;
}

export interface MealAssignment {
  id: string;
  studentId: string; // Student.id
  mealType: MealType;
  homeId: string; // Home.id
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface HomeAbsence {
  id: string;
  homeId: string; // Home.id
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  mealType: LeaveMealType;
  reason?: string;
  createdAt: string;
}

export interface StudentLeave {
  id: string;
  studentId: string; // Student.id
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  mealType: LeaveMealType;
  reason?: string;
  status: 'active' | 'cancelled';
  createdAt: string;
}

export interface BackupAssignment {
  id: string;
  studentId: string; // Student.id
  originalHomeId: string; // Home.id
  backupHomeId: string; // Home.id
  date: string; // YYYY-MM-DD
  mealType: MealType;
  reason?: string;
  createdAt: string;
}

export interface HomeDailySummary {
  home: Home;
  date: string;
  breakfast: {
    expectedCount: number;
    baseCount: number;
    students: {
      student: Student;
      isOnLeave: boolean;
      isBackup: boolean;
      originalHome?: Home;
    }[];
  };
  lunch: {
    expectedCount: number;
    baseCount: number;
    students: {
      student: Student;
      isOnLeave: boolean;
      isBackup: boolean;
      originalHome?: Home;
    }[];
  };
  dinner: {
    expectedCount: number;
    baseCount: number;
    students: {
      student: Student;
      isOnLeave: boolean;
      isBackup: boolean;
      originalHome?: Home;
    }[];
  };
  isAbsent: boolean;
  absenceReason?: string;
  allStudentsOnLeave: boolean;
}

export interface StudentDailySchedule {
  date: string;
  student: Student;
  meals: {
    breakfast: {
      home?: Home;
      isHostAbsent: boolean;
      backupHome?: Home;
      isOnLeave: boolean;
      assignmentId?: string;
    };
    lunch: {
      home?: Home;
      isHostAbsent: boolean;
      backupHome?: Home;
      isOnLeave: boolean;
      assignmentId?: string;
    };
    dinner: {
      home?: Home;
      isHostAbsent: boolean;
      backupHome?: Home;
      isOnLeave: boolean;
      assignmentId?: string;
    };
  };
}

