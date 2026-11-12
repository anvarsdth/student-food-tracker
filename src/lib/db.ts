import fs from 'fs';
import path from 'path';
import {
  User,
  Student,
  Home,
  MealAssignment,
  HomeAbsence,
  StudentLeave,
  BackupAssignment,
  HomeDailySummary,
  StudentDailySchedule,
  MealType,
  LeaveMealType,
} from '@/types';

interface DatabaseSchema {
  users: User[];
  students: Student[];
  homes: Home[];
  mealAssignments: MealAssignment[];
  homeAbsences: HomeAbsence[];
  studentLeaves: StudentLeave[];
  backupAssignments: BackupAssignment[];
}

// Use /tmp on Vercel (serverless, read-only fs except /tmp), or local data/ dir otherwise
const DB_FILE_PATH = process.env.VERCEL
  ? '/tmp/db.json'
  : path.join(process.cwd(), 'data', 'db.json');

// Helper to get today's date in YYYY-MM-DD format
export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const initialSeedData = (): DatabaseSchema => {
  const today = getTodayString();
  const tomorrow = getOffsetDateString(1);
  const dayAfterTomorrow = getOffsetDateString(2);

  const users: User[] = [
    {
      id: 'usr-admin-1',
      userId: 'ADM01',
      password: 'password123',
      role: 'admin',
      name: 'Coordinator Ahmad',
      phone: '+919876543210',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-101',
      userId: 'STU101',
      password: 'password123',
      role: 'student',
      name: 'Zayd Mansoor',
      phone: '+919123456701',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-102',
      userId: 'STU102',
      password: 'password123',
      role: 'student',
      name: 'Bilal Hassan',
      phone: '+919123456702',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-103',
      userId: 'STU103',
      password: 'password123',
      role: 'student',
      name: 'Tariq Jamil',
      phone: '+919123456703',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-104',
      userId: 'STU104',
      password: 'password123',
      role: 'student',
      name: 'Hamza Farooq',
      phone: '+919123456704',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-105',
      userId: 'STU105',
      password: 'password123',
      role: 'student',
      name: 'Omar Khalid',
      phone: '+919123456705',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-106',
      userId: 'STU106',
      password: 'password123',
      role: 'student',
      name: 'Salman Faris',
      phone: '+919123456706',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-201',
      userId: 'HOM201',
      password: 'password123',
      role: 'host',
      name: 'Haji Noor (Baitul Barakah)',
      phone: '+919845011201',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-202',
      userId: 'HOM202',
      password: 'password123',
      role: 'host',
      name: 'Uncle Kareem (Darul Aman)',
      phone: '+919845011202',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-203',
      userId: 'HOM203',
      password: 'password123',
      role: 'host',
      name: 'Haji Usman (Al-Hikmah)',
      phone: '+919845011203',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-204',
      userId: 'HOM204',
      password: 'password123',
      role: 'host',
      name: 'Brother Rafiq (Rahmath)',
      phone: '+919845011204',
      createdAt: new Date().toISOString(),
    },
  ];

  const students: Student[] = [
    {
      id: 'stu-1',
      userId: 'STU101',
      name: 'Zayd Mansoor',
      phone: '+919123456701',
      roomNo: 'Room 102',
      hostelBlock: 'Main Block A',
      emergencyContact: '+919899011111',
      status: 'active',
      notes: 'Final year Hadith student',
    },
    {
      id: 'stu-2',
      userId: 'STU102',
      name: 'Bilal Hassan',
      phone: '+919123456702',
      roomNo: 'Room 103',
      hostelBlock: 'Main Block A',
      emergencyContact: '+919899011112',
      status: 'active',
      notes: 'Prefers vegetarian when available',
    },
    {
      id: 'stu-3',
      userId: 'STU103',
      name: 'Tariq Jamil',
      phone: '+919123456703',
      roomNo: 'Room 201',
      hostelBlock: 'Block B',
      emergencyContact: '+919899011113',
      status: 'active',
    },
    {
      id: 'stu-4',
      userId: 'STU104',
      name: 'Hamza Farooq',
      phone: '+919123456704',
      roomNo: 'Room 204',
      hostelBlock: 'Block B',
      emergencyContact: '+919899011114',
      status: 'active',
    },
    {
      id: 'stu-5',
      userId: 'STU105',
      name: 'Omar Khalid',
      phone: '+919123456705',
      roomNo: 'Room 301',
      hostelBlock: 'Block C',
      emergencyContact: '+919899011115',
      status: 'active',
    },
    {
      id: 'stu-6',
      userId: 'STU106',
      name: 'Salman Faris',
      phone: '+919123456706',
      roomNo: 'Room 302',
      hostelBlock: 'Block C',
      emergencyContact: '+919899011116',
      status: 'active',
    },
  ];

  const homes: Home[] = [
    {
      id: 'hom-1',
      userId: 'HOM201',
      hostName: 'Baitul Barakah (Haji Noor)',
      phone: '+919845011201',
      address: '44 Garden Road, 1st Cross, Near Green Central Mosque',
      landmark: 'Opposite Green Central Mosque Gate 2',
      breakfastCapacity: 4,
      lunchCapacity: 4,
      dinnerCapacity: 4,
      googleMapsUrl: 'https://maps.google.com/?q=Central+Mosque',
      notes: 'Breakfast available between 7:30 AM - 8:45 AM',
    },
    {
      id: 'hom-2',
      userId: 'HOM202',
      hostName: 'Darul Aman (Uncle Kareem)',
      phone: '+919845011202',
      address: '12 Crescent Lane, 2nd Main Road',
      landmark: 'Near Historic Clock Tower',
      breakfastCapacity: 3,
      lunchCapacity: 3,
      dinnerCapacity: 3,
      googleMapsUrl: 'https://maps.google.com/?q=Clock+Tower',
      notes: 'Warm family, serves traditional lunch',
    },
    {
      id: 'hom-3',
      userId: 'HOM203',
      hostName: 'Al-Hikmah Villa (Haji Usman)',
      phone: '+919845011203',
      address: '88 College Road, Near Markaz Library',
      landmark: 'Beside Markaz Library Corner',
      breakfastCapacity: 4,
      lunchCapacity: 4,
      dinnerCapacity: 4,
      googleMapsUrl: 'https://maps.google.com/?q=Markaz+Library',
      notes: 'Large dining room, students can study post-dinner',
    },
    {
      id: 'hom-4',
      userId: 'HOM204',
      hostName: 'Rahmath House (Brother Rafiq)',
      phone: '+919845011204',
      address: '15 Hillview Colony, Behind Metro Station',
      landmark: 'Behind Metro Station Pillar 42',
      breakfastCapacity: 2,
      lunchCapacity: 2,
      dinnerCapacity: 2,
      googleMapsUrl: 'https://maps.google.com/?q=Metro+Pillar+42',
      notes: 'Currently traveling for family ceremony',
    },
  ];

  // Meal Assignment Matrix:
  // A student might eat Breakfast at Home A, Lunch at Home B, and Dinner at Home C.
  const mealAssignments: MealAssignment[] = [
    // Zayd (STU101)
    { id: 'asgn-1', studentId: 'stu-1', mealType: 'breakfast', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-2', studentId: 'stu-1', mealType: 'lunch', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-3', studentId: 'stu-1', mealType: 'dinner', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },

    // Bilal (STU102)
    { id: 'asgn-4', studentId: 'stu-2', mealType: 'breakfast', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-5', studentId: 'stu-2', mealType: 'lunch', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-6', studentId: 'stu-2', mealType: 'dinner', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },

    // Tariq (STU103)
    { id: 'asgn-7', studentId: 'stu-3', mealType: 'breakfast', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-8', studentId: 'stu-3', mealType: 'lunch', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-9', studentId: 'stu-3', mealType: 'dinner', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },

    // Hamza (STU104)
    { id: 'asgn-10', studentId: 'stu-4', mealType: 'breakfast', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-11', studentId: 'stu-4', mealType: 'lunch', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-12', studentId: 'stu-4', mealType: 'dinner', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },

    // Omar (STU105)
    { id: 'asgn-13', studentId: 'stu-5', mealType: 'breakfast', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-14', studentId: 'stu-5', mealType: 'lunch', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-15', studentId: 'stu-5', mealType: 'dinner', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },

    // Salman (STU106)
    { id: 'asgn-16', studentId: 'stu-6', mealType: 'breakfast', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-17', studentId: 'stu-6', mealType: 'lunch', homeId: 'hom-4', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-18', studentId: 'stu-6', mealType: 'dinner', homeId: 'hom-4', isActive: true, createdAt: new Date().toISOString() },
  ];

  // Seed sample Home Absence:
  // HOM204 is unavailable today and tomorrow due to a family wedding
  const homeAbsences: HomeAbsence[] = [
    {
      id: 'abs-1',
      homeId: 'hom-4',
      startDate: today,
      endDate: tomorrow,
      mealType: 'all',
      reason: 'Attending family wedding out of station',
      createdAt: new Date().toISOString(),
    },
  ];

  // Seed sample Student Leave:
  // Tariq (stu-3) is on leave for Dinner today
  const studentLeaves: StudentLeave[] = [
    {
      id: 'leave-1',
      studentId: 'stu-3',
      startDate: today,
      endDate: today,
      mealType: 'dinner',
      reason: 'Visiting doctor / fasting voluntary fast',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];

  // Seed sample Backup Assignment:
  // Salman (stu-6) normally eats dinner at HOM204, but HOM204 is absent today!
  // Admin re-assigned Salman to HOM201 for today's dinner
  const backupAssignments: BackupAssignment[] = [
    {
      id: 'backup-1',
      studentId: 'stu-6',
      originalHomeId: 'hom-4',
      backupHomeId: 'hom-1',
      date: today,
      mealType: 'dinner',
      reason: 'Regular host HOM204 unavailable today',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    users,
    students,
    homes,
    mealAssignments,
    homeAbsences,
    studentLeaves,
    backupAssignments,
  };
};

let memoryDb: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      memoryDb = JSON.parse(content);
      return memoryDb!;
    }
  } catch (err) {
    console.warn('Failed to read db file from disk, using initial seed in memory:', err);
  }

  memoryDb = initialSeedData();
  saveDatabase(memoryDb);
  return memoryDb;
}

export function saveDatabase(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

export function resetDatabase(): DatabaseSchema {
  memoryDb = initialSeedData();
  saveDatabase(memoryDb);
  return memoryDb;
}

// -------------------------------------------------------------
// Queries & Data Access Methods
// -------------------------------------------------------------

export function findUserByCredentials(userId: string, password: string): User | null {
  const db = getDatabase();
  const normalizedId = userId.trim().toUpperCase();
  return (
    db.users.find(
      (u) => u.userId.toUpperCase() === normalizedId && u.password === password
    ) || null
  );
}

export function getAllStudents(): Student[] {
  return getDatabase().students;
}

export function getStudentById(id: string): Student | null {
  return getDatabase().students.find((s) => s.id === id) || null;
}

export function getStudentByUserId(userId: string): Student | null {
  return getDatabase().students.find((s) => s.userId.toUpperCase() === userId.toUpperCase()) || null;
}

export function createStudent(data: Omit<Student, 'id'> & { password?: string }): Student {
  const db = getDatabase();
  const newId = 'stu-' + Date.now();
  const newStudent: Student = {
    id: newId,
    userId: data.userId.toUpperCase(),
    name: data.name,
    phone: data.phone,
    roomNo: data.roomNo,
    hostelBlock: data.hostelBlock,
    emergencyContact: data.emergencyContact,
    status: data.status || 'active',
    notes: data.notes,
  };

  // Add corresponding user account if not exists
  const existingUser = db.users.find((u) => u.userId.toUpperCase() === newStudent.userId);
  if (!existingUser) {
    db.users.push({
      id: 'usr-' + newId,
      userId: newStudent.userId,
      password: data.password || 'password123',
      role: 'student',
      name: newStudent.name,
      phone: newStudent.phone,
      createdAt: new Date().toISOString(),
    });
  }

  db.students.push(newStudent);
  saveDatabase(db);
  return newStudent;
}

export function updateStudent(id: string, updates: Partial<Student>): Student | null {
  const db = getDatabase();
  const idx = db.students.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  db.students[idx] = { ...db.students[idx], ...updates };

  // Sync user info if name or phone changed
  const student = db.students[idx];
  const userIdx = db.users.findIndex((u) => u.userId.toUpperCase() === student.userId.toUpperCase());
  if (userIdx !== -1) {
    db.users[userIdx].name = student.name;
    db.users[userIdx].phone = student.phone;
  }

  saveDatabase(db);
  return db.students[idx];
}

export function deleteStudent(id: string): boolean {
  const db = getDatabase();
  const student = db.students.find((s) => s.id === id);
  if (!student) return false;

  db.students = db.students.filter((s) => s.id !== id);
  db.users = db.users.filter((u) => u.userId.toUpperCase() !== student.userId.toUpperCase());
  db.mealAssignments = db.mealAssignments.filter((m) => m.studentId !== id);
  db.studentLeaves = db.studentLeaves.filter((l) => l.studentId !== id);
  db.backupAssignments = db.backupAssignments.filter((b) => b.studentId !== id);

  saveDatabase(db);
  return true;
}

export function getAllHomes(): Home[] {
  return getDatabase().homes;
}

export function getHomeById(id: string): Home | null {
  return getDatabase().homes.find((h) => h.id === id) || null;
}

export function getHomeByUserId(userId: string): Home | null {
  return getDatabase().homes.find((h) => h.userId.toUpperCase() === userId.toUpperCase()) || null;
}

export function createHome(data: Omit<Home, 'id'> & { password?: string }): Home {
  const db = getDatabase();
  const newId = 'hom-' + Date.now();
  const newHome: Home = {
    id: newId,
    userId: data.userId.toUpperCase(),
    hostName: data.hostName,
    phone: data.phone,
    address: data.address,
    landmark: data.landmark,
    breakfastCapacity: Number(data.breakfastCapacity) || 4,
    lunchCapacity: Number(data.lunchCapacity) || 4,
    dinnerCapacity: Number(data.dinnerCapacity) || 4,
    googleMapsUrl: data.googleMapsUrl,
    notes: data.notes,
  };

  const existingUser = db.users.find((u) => u.userId.toUpperCase() === newHome.userId);
  if (!existingUser) {
    db.users.push({
      id: 'usr-' + newId,
      userId: newHome.userId,
      password: data.password || 'password123',
      role: 'host',
      name: newHome.hostName,
      phone: newHome.phone,
      createdAt: new Date().toISOString(),
    });
  }

  db.homes.push(newHome);
  saveDatabase(db);
  return newHome;
}

export function updateHome(id: string, updates: Partial<Home>): Home | null {
  const db = getDatabase();
  const idx = db.homes.findIndex((h) => h.id === id);
  if (idx === -1) return null;

  db.homes[idx] = { ...db.homes[idx], ...updates };

  const home = db.homes[idx];
  const userIdx = db.users.findIndex((u) => u.userId.toUpperCase() === home.userId.toUpperCase());
  if (userIdx !== -1) {
    db.users[userIdx].name = home.hostName;
    db.users[userIdx].phone = home.phone;
  }

  saveDatabase(db);
  return db.homes[idx];
}

export function deleteHome(id: string): boolean {
  const db = getDatabase();
  const home = db.homes.find((h) => h.id === id);
  if (!home) return false;

  db.homes = db.homes.filter((h) => h.id !== id);
  db.users = db.users.filter((u) => u.userId.toUpperCase() !== home.userId.toUpperCase());
  db.mealAssignments = db.mealAssignments.filter((m) => m.homeId !== id);
  db.homeAbsences = db.homeAbsences.filter((a) => a.homeId !== id);
  db.backupAssignments = db.backupAssignments.filter((b) => b.originalHomeId !== id && b.backupHomeId !== id);

  saveDatabase(db);
  return true;
}

// -------------------------------------------------------------
// Meal Assignment Operations
// -------------------------------------------------------------

export function getAllMealAssignments(): MealAssignment[] {
  return getDatabase().mealAssignments;
}

export function setMealAssignment(studentId: string, mealType: MealType, homeId: string): MealAssignment {
  const db = getDatabase();
  const existingIdx = db.mealAssignments.findIndex(
    (m) => m.studentId === studentId && m.mealType === mealType
  );

  if (existingIdx !== -1) {
    db.mealAssignments[existingIdx].homeId = homeId;
    db.mealAssignments[existingIdx].isActive = true;
    db.mealAssignments[existingIdx].updatedAt = new Date().toISOString();
    saveDatabase(db);
    return db.mealAssignments[existingIdx];
  }

  const newAssignment: MealAssignment = {
    id: 'asgn-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    studentId,
    mealType,
    homeId,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  db.mealAssignments.push(newAssignment);
  saveDatabase(db);
  return newAssignment;
}

export function bulkUpdateAssignments(assignments: { studentId: string; breakfastHomeId: string; lunchHomeId: string; dinnerHomeId: string }[]): void {
  for (const item of assignments) {
    if (item.breakfastHomeId) setMealAssignment(item.studentId, 'breakfast', item.breakfastHomeId);
    if (item.lunchHomeId) setMealAssignment(item.studentId, 'lunch', item.lunchHomeId);
    if (item.dinnerHomeId) setMealAssignment(item.studentId, 'dinner', item.dinnerHomeId);
  }
}

// -------------------------------------------------------------
// Student Leave Operations
// -------------------------------------------------------------

export function getAllStudentLeaves(): StudentLeave[] {
  return getDatabase().studentLeaves;
}

export function createStudentLeave(params: {
  studentId: string;
  startDate: string;
  endDate: string;
  mealType: LeaveMealType;
  reason?: string;
}): StudentLeave {
  const db = getDatabase();
  const newLeave: StudentLeave = {
    id: 'leave-' + Date.now(),
    studentId: params.studentId,
    startDate: params.startDate,
    endDate: params.endDate,
    mealType: params.mealType,
    reason: params.reason,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  db.studentLeaves.unshift(newLeave);
  saveDatabase(db);
  return newLeave;
}

export function cancelStudentLeave(id: string): boolean {
  const db = getDatabase();
  const idx = db.studentLeaves.findIndex((l) => l.id === id);
  if (idx === -1) return false;

  db.studentLeaves[idx].status = 'cancelled';
  saveDatabase(db);
  return true;
}

export function isStudentOnLeave(studentId: string, date: string, mealType: MealType): boolean {
  const db = getDatabase();
  return db.studentLeaves.some((l) => {
    if (l.studentId !== studentId || l.status !== 'active') return false;
    if (date < l.startDate || date > l.endDate) return false;
    return l.mealType === 'all' || l.mealType === mealType;
  });
}

// -------------------------------------------------------------
// Home Absence Operations
// -------------------------------------------------------------

export function getAllHomeAbsences(): HomeAbsence[] {
  return getDatabase().homeAbsences;
}

export function createHomeAbsence(params: {
  homeId: string;
  startDate: string;
  endDate: string;
  mealType: LeaveMealType;
  reason?: string;
}): HomeAbsence {
  const db = getDatabase();
  const newAbsence: HomeAbsence = {
    id: 'abs-' + Date.now(),
    homeId: params.homeId,
    startDate: params.startDate,
    endDate: params.endDate,
    mealType: params.mealType,
    reason: params.reason,
    createdAt: new Date().toISOString(),
  };

  db.homeAbsences.unshift(newAbsence);
  saveDatabase(db);
  return newAbsence;
}

export function deleteHomeAbsence(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.homeAbsences.length;
  db.homeAbsences = db.homeAbsences.filter((a) => a.id !== id);
  if (db.homeAbsences.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

export function isHomeAbsent(homeId: string, date: string, mealType?: MealType): { absent: boolean; reason?: string } {
  const db = getDatabase();
  const match = db.homeAbsences.find((a) => {
    if (a.homeId !== homeId) return false;
    if (date < a.startDate || date > a.endDate) return false;
    if (!mealType) return true;
    return a.mealType === 'all' || a.mealType === mealType;
  });

  return {
    absent: !!match,
    reason: match?.reason,
  };
}

// -------------------------------------------------------------
// Backup Assignment Operations (Admin reassignments)
// -------------------------------------------------------------

export function getAllBackupAssignments(): BackupAssignment[] {
  return getDatabase().backupAssignments;
}

export function createBackupAssignment(params: {
  studentId: string;
  originalHomeId: string;
  backupHomeId: string;
  date: string;
  mealType: MealType;
  reason?: string;
}): BackupAssignment {
  const db = getDatabase();

  // Remove existing backup for this student, date, meal
  db.backupAssignments = db.backupAssignments.filter(
    (b) => !(b.studentId === params.studentId && b.date === params.date && b.mealType === params.mealType)
  );

  const newBackup: BackupAssignment = {
    id: 'backup-' + Date.now(),
    studentId: params.studentId,
    originalHomeId: params.originalHomeId,
    backupHomeId: params.backupHomeId,
    date: params.date,
    mealType: params.mealType,
    reason: params.reason || 'Host home unavailable',
    createdAt: new Date().toISOString(),
  };

  db.backupAssignments.unshift(newBackup);
  saveDatabase(db);
  return newBackup;
}

export function deleteBackupAssignment(id: string): boolean {
  const db = getDatabase();
  const initialLen = db.backupAssignments.length;
  db.backupAssignments = db.backupAssignments.filter((b) => b.id !== id);
  if (db.backupAssignments.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// Aggregations & Headcounts
// -------------------------------------------------------------

export function getHomeDailySummary(homeId: string, date: string): HomeDailySummary | null {
  const db = getDatabase();
  const home = db.homes.find((h) => h.id === homeId);
  if (!home) return null;

  const homeAbsenceInfo = isHomeAbsent(homeId, date);

  const calculateMeal = (mealType: MealType) => {
    // 1. Regular assigned students to this home for this meal
    const regularAssignments = db.mealAssignments.filter(
      (m) => m.homeId === homeId && m.mealType === mealType && m.isActive
    );

    // 2. Backup students reassigned to this home from other homes
    const backupsToThisHome = db.backupAssignments.filter(
      (b) => b.backupHomeId === homeId && b.date === date && b.mealType === mealType
    );

    // 3. Backup students who were reassigned AWAY from this home (because this home is absent)
    const backupsAwayFromThisHome = db.backupAssignments.filter(
      (b) => b.originalHomeId === homeId && b.date === date && b.mealType === mealType
    );
    const reassignedAwayStudentIds = new Set(backupsAwayFromThisHome.map((b) => b.studentId));

    const studentList: HomeDailySummary['breakfast']['students'] = [];

    // Add regular students (excluding those reassigned away)
    for (const asgn of regularAssignments) {
      if (reassignedAwayStudentIds.has(asgn.studentId)) {
        continue;
      }
      const student = db.students.find((s) => s.id === asgn.studentId);
      if (student && student.status === 'active') {
        const onLeave = isStudentOnLeave(student.id, date, mealType);
        studentList.push({
          student,
          isOnLeave: onLeave,
          isBackup: false,
        });
      }
    }

    // Add backup students
    for (const b of backupsToThisHome) {
      const student = db.students.find((s) => s.id === b.studentId);
      const originalHome = db.homes.find((h) => h.id === b.originalHomeId);
      if (student && student.status === 'active') {
        const onLeave = isStudentOnLeave(student.id, date, mealType);
        studentList.push({
          student,
          isOnLeave: onLeave,
          isBackup: true,
          originalHome,
        });
      }
    }

    const expectedCount = studentList.filter((s) => !s.isOnLeave).length;

    return {
      expectedCount,
      baseCount: studentList.length,
      students: studentList,
    };
  };

  const breakfast = calculateMeal('breakfast');
  const lunch = calculateMeal('lunch');
  const dinner = calculateMeal('dinner');

  const totalBase = breakfast.baseCount + lunch.baseCount + dinner.baseCount;
  const totalExpected = breakfast.expectedCount + lunch.expectedCount + dinner.expectedCount;
  const allStudentsOnLeave = totalBase > 0 && totalExpected === 0;

  return {
    home,
    date,
    breakfast,
    lunch,
    dinner,
    isAbsent: homeAbsenceInfo.absent,
    absenceReason: homeAbsenceInfo.reason,
    allStudentsOnLeave,
  };
}

export function getAllHomesDailySummary(date: string): HomeDailySummary[] {
  const db = getDatabase();
  return db.homes
    .map((h) => getHomeDailySummary(h.id, date))
    .filter((s): s is HomeDailySummary => s !== null);
}

export function getStudentDailySchedule(studentId: string, date: string): StudentDailySchedule | null {
  const db = getDatabase();
  const student = db.students.find((s) => s.id === studentId);
  if (!student) return null;

  const buildMealSchedule = (mealType: MealType) => {
    const regularAsgn = db.mealAssignments.find(
      (m) => m.studentId === studentId && m.mealType === mealType && m.isActive
    );

    const regularHome = regularAsgn ? db.homes.find((h) => h.id === regularAsgn.homeId) : undefined;
    const isHostAbsent = regularHome ? isHomeAbsent(regularHome.id, date, mealType).absent : false;

    // Check backup assignment
    const backupAsgn = db.backupAssignments.find(
      (b) => b.studentId === studentId && b.date === date && b.mealType === mealType
    );
    const backupHome = backupAsgn ? db.homes.find((h) => h.id === backupAsgn.backupHomeId) : undefined;

    const isOnLeave = isStudentOnLeave(studentId, date, mealType);

    return {
      home: regularHome,
      isHostAbsent,
      backupHome,
      isOnLeave,
      assignmentId: regularAsgn?.id,
    };
  };

  return {
    date,
    student,
    meals: {
      breakfast: buildMealSchedule('breakfast'),
      lunch: buildMealSchedule('lunch'),
      dinner: buildMealSchedule('dinner'),
    },
  };
}

