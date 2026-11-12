import connectDB from '@/lib/db';
import {
  User,
  Student,
  Home,
  MealAssignment,
  HomeAbsence,
  StudentLeave,
  BackupAssignment,
} from '@/models';
import {
  User as UserType,
  Student as StudentType,
  Home as HomeType,
  MealAssignment as MealAssignmentType,
  HomeAbsence as HomeAbsenceType,
  StudentLeave as StudentLeaveType,
  BackupAssignment as BackupAssignmentType,
  HomeDailySummary,
  StudentDailySchedule,
  MealType,
  LeaveMealType,
} from '@/types';

export { connectDB };
export * from '@/models';

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

export const getInitialSeedData = () => {
  const today = getTodayString();
  const tomorrow = getOffsetDateString(1);

  const users: UserType[] = [
    {
      id: 'usr-admin-1',
      userId: 'ADM01',
      password: 'anvar@9483',
      role: 'admin',
      name: 'Coordinator Ahmad',
      phone: '+919876543210',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-1',
      userId: 'STU101',
      password: 'password123',
      role: 'student',
      name: 'Zayd Mansoor',
      phone: '+919123456701',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-2',
      userId: 'STU102',
      password: 'password123',
      role: 'student',
      name: 'Bilal Hassan',
      phone: '+919123456702',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-3',
      userId: 'STU103',
      password: 'password123',
      role: 'student',
      name: 'Tariq Jamil',
      phone: '+919123456703',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-4',
      userId: 'STU104',
      password: 'password123',
      role: 'student',
      name: 'Hamza Farooq',
      phone: '+919123456704',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-5',
      userId: 'STU105',
      password: 'password123',
      role: 'student',
      name: 'Omar Khalid',
      phone: '+919123456705',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-stu-6',
      userId: 'STU106',
      password: 'password123',
      role: 'student',
      name: 'Salman Faris',
      phone: '+919123456706',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-1',
      userId: 'HOM201',
      password: 'password123',
      role: 'host',
      name: 'Haji Noor (Baitul Barakah)',
      phone: '+919845011201',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-2',
      userId: 'HOM202',
      password: 'password123',
      role: 'host',
      name: 'Uncle Kareem (Darul Aman)',
      phone: '+919845011202',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-3',
      userId: 'HOM203',
      password: 'password123',
      role: 'host',
      name: 'Haji Usman (Al-Hikmah)',
      phone: '+919845011203',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-hom-4',
      userId: 'HOM204',
      password: 'password123',
      role: 'host',
      name: 'Brother Rafiq (Rahmath)',
      phone: '+919845011204',
      createdAt: new Date().toISOString(),
    },
  ];

  const students: StudentType[] = [
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
      roomNo: 'Room 105',
      hostelBlock: 'Main Block A',
      emergencyContact: '+919899011113',
      status: 'active',
      notes: 'Third year student',
    },
    {
      id: 'stu-4',
      userId: 'STU104',
      name: 'Hamza Farooq',
      phone: '+919123456704',
      roomNo: 'Room 201',
      hostelBlock: 'Block B',
      emergencyContact: '+919899011114',
      status: 'active',
    },
    {
      id: 'stu-5',
      userId: 'STU105',
      name: 'Omar Khalid',
      phone: '+919123456705',
      roomNo: 'Room 204',
      hostelBlock: 'Block B',
      emergencyContact: '+919899011115',
      status: 'active',
    },
    {
      id: 'stu-6',
      userId: 'STU106',
      name: 'Salman Faris',
      phone: '+919123456706',
      roomNo: 'Room 208',
      hostelBlock: 'Block B',
      emergencyContact: '+919899011116',
      status: 'active',
    },
  ];

  const homes: HomeType[] = [
    {
      id: 'hom-1',
      userId: 'HOM201',
      hostName: 'Baitul Barakah (Haji Noor)',
      phone: '+919845011201',
      address: '44 Garden Road, 1st Cross, Near Green Central Mosque',
      landmark: 'Opposite Bilal General Store',
      breakfastCapacity: 4,
      lunchCapacity: 4,
      dinnerCapacity: 4,
      googleMapsUrl: 'https://maps.google.com/?q=12.9716,77.5946',
      notes: 'Warm family, serves food promptly at 7:30 AM, 1:15 PM, 8:30 PM',
    },
    {
      id: 'hom-2',
      userId: 'HOM202',
      hostName: 'Darul Aman (Uncle Kareem)',
      phone: '+919845011202',
      address: '12 Crescent Lane, 2nd Main Road',
      landmark: 'Next to Islamic Book Center',
      breakfastCapacity: 3,
      lunchCapacity: 3,
      dinnerCapacity: 3,
      googleMapsUrl: 'https://maps.google.com/?q=12.9720,77.5950',
      notes: 'Elderly couple, peaceful environment',
    },
    {
      id: 'hom-3',
      userId: 'HOM203',
      hostName: 'Al-Hikmah Villa (Haji Usman)',
      phone: '+919845011203',
      address: '88 College Road, Near Markaz Library',
      landmark: 'Behind City Hospital',
      breakfastCapacity: 4,
      lunchCapacity: 5,
      dinnerCapacity: 5,
      googleMapsUrl: 'https://maps.google.com/?q=12.9730,77.5960',
      notes: 'Large dining room, can accommodate extra students on notice',
    },
    {
      id: 'hom-4',
      userId: 'HOM204',
      hostName: 'Rahmath House (Brother Rafiq)',
      phone: '+919845011204',
      address: '15 Hillview Colony, Behind Metro Station',
      landmark: 'Near Al-Ameen Clinic',
      breakfastCapacity: 3,
      lunchCapacity: 3,
      dinnerCapacity: 3,
      googleMapsUrl: 'https://maps.google.com/?q=12.9740,77.5970',
      notes: '5 minutes walk from hostel',
    },
  ];

  const mealAssignments: MealAssignmentType[] = [
    { id: 'asgn-1', studentId: 'stu-1', mealType: 'breakfast', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-2', studentId: 'stu-1', mealType: 'lunch', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-3', studentId: 'stu-1', mealType: 'dinner', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },

    { id: 'asgn-4', studentId: 'stu-2', mealType: 'breakfast', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-5', studentId: 'stu-2', mealType: 'lunch', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-6', studentId: 'stu-2', mealType: 'dinner', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },

    { id: 'asgn-7', studentId: 'stu-3', mealType: 'breakfast', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-8', studentId: 'stu-3', mealType: 'lunch', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-9', studentId: 'stu-3', mealType: 'dinner', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },

    { id: 'asgn-10', studentId: 'stu-4', mealType: 'breakfast', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-11', studentId: 'stu-4', mealType: 'lunch', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-12', studentId: 'stu-4', mealType: 'dinner', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },

    { id: 'asgn-13', studentId: 'stu-5', mealType: 'breakfast', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-14', studentId: 'stu-5', mealType: 'lunch', homeId: 'hom-1', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-15', studentId: 'stu-5', mealType: 'dinner', homeId: 'hom-3', isActive: true, createdAt: new Date().toISOString() },

    { id: 'asgn-16', studentId: 'stu-6', mealType: 'breakfast', homeId: 'hom-2', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-17', studentId: 'stu-6', mealType: 'lunch', homeId: 'hom-4', isActive: true, createdAt: new Date().toISOString() },
    { id: 'asgn-18', studentId: 'stu-6', mealType: 'dinner', homeId: 'hom-4', isActive: true, createdAt: new Date().toISOString() },
  ];

  const homeAbsences: HomeAbsenceType[] = [
    {
      id: 'abs-1',
      homeId: 'hom-4',
      startDate: today,
      endDate: tomorrow,
      mealType: 'all',
      reason: 'Family attending wedding in hometown',
      createdAt: new Date().toISOString(),
    },
  ];

  const studentLeaves: StudentLeaveType[] = [
    {
      id: 'leave-1',
      studentId: 'stu-3',
      startDate: today,
      endDate: today,
      mealType: 'dinner',
      reason: 'Visiting relative for dinner',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];

  const backupAssignments: BackupAssignmentType[] = [
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

export async function ensureSeedData() {
  await connectDB();
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await resetDatabase();
  }
}

export async function resetDatabase() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Home.deleteMany({}),
    MealAssignment.deleteMany({}),
    HomeAbsence.deleteMany({}),
    StudentLeave.deleteMany({}),
    BackupAssignment.deleteMany({}),
  ]);

  const seed = getInitialSeedData();
  await Promise.all([
    User.insertMany(seed.users),
    Student.insertMany(seed.students),
    Home.insertMany(seed.homes),
    MealAssignment.insertMany(seed.mealAssignments),
    HomeAbsence.insertMany(seed.homeAbsences),
    StudentLeave.insertMany(seed.studentLeaves),
    BackupAssignment.insertMany(seed.backupAssignments),
  ]);

  return { success: true };
}

// -------------------------------------------------------------
// Queries & Data Access Methods
// -------------------------------------------------------------

export async function findUserByCredentials(userId: string, password?: string): Promise<UserType | null> {
  await ensureSeedData();
  const normalizedId = (userId || '').trim().toUpperCase();
  const normalizedPass = (password || '').trim();

  // Primary check: exact match
  let user = await User.findOne({ userId: normalizedId, password: normalizedPass }).lean();

  // If admin uses the official new password
  if (!user && normalizedId === 'ADM01' && normalizedPass === 'anvar@9483') {
    await User.updateOne({ userId: 'ADM01' }, { $set: { password: 'anvar@9483' } });
    user = await User.findOne({ userId: 'ADM01' }).lean();
  }

  // Fallback for regular demo users
  if (!user && normalizedPass === 'password123' && normalizedId !== 'ADM01') {
    user = await User.findOne({ userId: normalizedId }).lean();
  }

  return (user as unknown as UserType) || null;
}

export async function getAllStudents(): Promise<StudentType[]> {
  await ensureSeedData();
  const students = await Student.find({}).lean();
  return students as unknown as StudentType[];
}

export async function getStudentById(id: string): Promise<StudentType | null> {
  await ensureSeedData();
  const student = await Student.findOne({ id }).lean();
  return (student as unknown as StudentType) || null;
}

export async function getStudentByUserId(userId: string): Promise<StudentType | null> {
  await ensureSeedData();
  const student = await Student.findOne({ userId: userId.toUpperCase() }).lean();
  return (student as unknown as StudentType) || null;
}

export async function createStudent(data: Omit<StudentType, 'id'> & { password?: string }): Promise<StudentType> {
  await ensureSeedData();
  const newId = 'stu-' + Date.now();
  const newStudent: StudentType = {
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

  const existingUser = await User.findOne({ userId: newStudent.userId });
  if (!existingUser) {
    await User.create({
      id: 'usr-' + newId,
      userId: newStudent.userId,
      password: data.password || 'password123',
      role: 'student',
      name: newStudent.name,
      phone: newStudent.phone,
      createdAt: new Date().toISOString(),
    });
  }

  const created = await Student.create(newStudent);
  return created.toObject() as unknown as StudentType;
}

export async function updateStudent(id: string, updates: Partial<StudentType>): Promise<StudentType | null> {
  await ensureSeedData();
  const updated = await Student.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
  if (!updated) return null;

  if (updates.name || updates.phone) {
    await User.updateOne(
      { userId: (updated as any).userId },
      { $set: { ...(updates.name && { name: updates.name }), ...(updates.phone && { phone: updates.phone }) } }
    );
  }

  return updated as unknown as StudentType;
}

export async function deleteStudent(id: string): Promise<boolean> {
  await ensureSeedData();
  const student = await Student.findOne({ id });
  if (!student) return false;

  await Promise.all([
    Student.deleteOne({ id }),
    User.deleteOne({ userId: student.userId }),
    MealAssignment.deleteMany({ studentId: id }),
    StudentLeave.deleteMany({ studentId: id }),
    BackupAssignment.deleteMany({ studentId: id }),
  ]);

  return true;
}

export async function getAllHomes(): Promise<HomeType[]> {
  await ensureSeedData();
  const homes = await Home.find({}).lean();
  return homes as unknown as HomeType[];
}

export async function getHomeById(id: string): Promise<HomeType | null> {
  await ensureSeedData();
  const home = await Home.findOne({ id }).lean();
  return (home as unknown as HomeType) || null;
}

export async function getHomeByUserId(userId: string): Promise<HomeType | null> {
  await ensureSeedData();
  const home = await Home.findOne({ userId: userId.toUpperCase() }).lean();
  return (home as unknown as HomeType) || null;
}

export async function createHome(data: Omit<HomeType, 'id'> & { password?: string }): Promise<HomeType> {
  await ensureSeedData();
  const newId = 'hom-' + Date.now();
  const newHome: HomeType = {
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

  const existingUser = await User.findOne({ userId: newHome.userId });
  if (!existingUser) {
    await User.create({
      id: 'usr-' + newId,
      userId: newHome.userId,
      password: data.password || 'password123',
      role: 'host',
      name: newHome.hostName,
      phone: newHome.phone,
      createdAt: new Date().toISOString(),
    });
  }

  const created = await Home.create(newHome);
  return created.toObject() as unknown as HomeType;
}

export async function updateHome(id: string, updates: Partial<HomeType>): Promise<HomeType | null> {
  await ensureSeedData();
  const updated = await Home.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
  if (!updated) return null;

  if (updates.hostName || updates.phone) {
    await User.updateOne(
      { userId: (updated as any).userId },
      { $set: { ...(updates.hostName && { name: updates.hostName }), ...(updates.phone && { phone: updates.phone }) } }
    );
  }

  return updated as unknown as HomeType;
}

export async function deleteHome(id: string): Promise<boolean> {
  await ensureSeedData();
  const home = await Home.findOne({ id });
  if (!home) return false;

  await Promise.all([
    Home.deleteOne({ id }),
    User.deleteOne({ userId: home.userId }),
    MealAssignment.deleteMany({ homeId: id }),
    HomeAbsence.deleteMany({ homeId: id }),
    BackupAssignment.deleteMany({ $or: [{ originalHomeId: id }, { backupHomeId: id }] }),
  ]);

  return true;
}

export async function getAllMealAssignments(): Promise<MealAssignmentType[]> {
  await ensureSeedData();
  const list = await MealAssignment.find({}).lean();
  return list as unknown as MealAssignmentType[];
}

export async function setMealAssignment(studentId: string, mealType: MealType, homeId: string): Promise<MealAssignmentType> {
  await ensureSeedData();
  const updated = await MealAssignment.findOneAndUpdate(
    { studentId, mealType },
    {
      $set: {
        homeId,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      $setOnInsert: {
        id: 'asgn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true, new: true }
  ).lean();

  return updated as unknown as MealAssignmentType;
}

export async function bulkUpdateAssignments(
  assignments: { studentId: string; breakfastHomeId: string; lunchHomeId: string; dinnerHomeId: string }[]
): Promise<void> {
  await ensureSeedData();
  for (const item of assignments) {
    if (item.breakfastHomeId) await setMealAssignment(item.studentId, 'breakfast', item.breakfastHomeId);
    if (item.lunchHomeId) await setMealAssignment(item.studentId, 'lunch', item.lunchHomeId);
    if (item.dinnerHomeId) await setMealAssignment(item.studentId, 'dinner', item.dinnerHomeId);
  }
}

export async function getAllStudentLeaves(): Promise<StudentLeaveType[]> {
  await ensureSeedData();
  const leaves = await StudentLeave.find({}).sort({ createdAt: -1 }).lean();
  return leaves as unknown as StudentLeaveType[];
}

export async function createStudentLeave(params: {
  studentId: string;
  startDate: string;
  endDate: string;
  mealType: LeaveMealType;
  reason?: string;
}): Promise<StudentLeaveType> {
  await ensureSeedData();
  const newLeave: StudentLeaveType = {
    id: 'leave-' + Date.now(),
    studentId: params.studentId,
    startDate: params.startDate,
    endDate: params.endDate,
    mealType: params.mealType,
    reason: params.reason,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const created = await StudentLeave.create(newLeave);
  return created.toObject() as unknown as StudentLeaveType;
}

export async function cancelStudentLeave(id: string): Promise<boolean> {
  await ensureSeedData();
  const res = await StudentLeave.updateOne({ id }, { $set: { status: 'cancelled' } });
  return res.matchedCount > 0;
}

export async function isStudentOnLeave(studentId: string, date: string, mealType: MealType): Promise<boolean> {
  await ensureSeedData();
  const leaves = await StudentLeave.find({
    studentId,
    status: 'active',
    startDate: { $lte: date },
    endDate: { $gte: date },
  }).lean();

  return leaves.some((l) => l.mealType === 'all' || l.mealType === mealType);
}

export async function getAllHomeAbsences(): Promise<HomeAbsenceType[]> {
  await ensureSeedData();
  const absences = await HomeAbsence.find({}).sort({ createdAt: -1 }).lean();
  return absences as unknown as HomeAbsenceType[];
}

export async function createHomeAbsence(params: {
  homeId: string;
  startDate: string;
  endDate: string;
  mealType: LeaveMealType;
  reason?: string;
}): Promise<HomeAbsenceType> {
  await ensureSeedData();
  const newAbsence: HomeAbsenceType = {
    id: 'abs-' + Date.now(),
    homeId: params.homeId,
    startDate: params.startDate,
    endDate: params.endDate,
    mealType: params.mealType,
    reason: params.reason,
    createdAt: new Date().toISOString(),
  };

  const created = await HomeAbsence.create(newAbsence);
  return created.toObject() as unknown as HomeAbsenceType;
}

export async function deleteHomeAbsence(id: string): Promise<boolean> {
  await ensureSeedData();
  const res = await HomeAbsence.deleteOne({ id });
  return res.deletedCount > 0;
}

export async function isHomeAbsent(
  homeId: string,
  date: string,
  mealType?: MealType
): Promise<{ absent: boolean; reason?: string }> {
  await ensureSeedData();
  const absences = await HomeAbsence.find({
    homeId,
    startDate: { $lte: date },
    endDate: { $gte: date },
  }).lean();

  const match = absences.find((a) => {
    if (!mealType) return true;
    return a.mealType === 'all' || a.mealType === mealType;
  });

  return {
    absent: !!match,
    reason: match?.reason,
  };
}

export async function getAllBackupAssignments(): Promise<BackupAssignmentType[]> {
  await ensureSeedData();
  const list = await BackupAssignment.find({}).sort({ createdAt: -1 }).lean();
  return list as unknown as BackupAssignmentType[];
}

export async function createBackupAssignment(params: {
  studentId: string;
  originalHomeId: string;
  backupHomeId: string;
  date: string;
  mealType: MealType;
  reason?: string;
}): Promise<BackupAssignmentType> {
  await ensureSeedData();
  await BackupAssignment.deleteMany({
    studentId: params.studentId,
    date: params.date,
    mealType: params.mealType,
  });

  const newBackup: BackupAssignmentType = {
    id: 'backup-' + Date.now(),
    studentId: params.studentId,
    originalHomeId: params.originalHomeId,
    backupHomeId: params.backupHomeId,
    date: params.date,
    mealType: params.mealType,
    reason: params.reason || 'Host home unavailable',
    createdAt: new Date().toISOString(),
  };

  const created = await BackupAssignment.create(newBackup);
  return created.toObject() as unknown as BackupAssignmentType;
}

export async function deleteBackupAssignment(id: string): Promise<boolean> {
  await ensureSeedData();
  const res = await BackupAssignment.deleteOne({ id });
  return res.deletedCount > 0;
}

export async function getHomeDailySummary(homeId: string, date: string): Promise<HomeDailySummary | null> {
  await ensureSeedData();
  const [homes, students, assignments, backups, leaves, absences] = await Promise.all([
    Home.find({}).lean(),
    Student.find({}).lean(),
    MealAssignment.find({ isActive: true }).lean(),
    BackupAssignment.find({ date }).lean(),
    StudentLeave.find({ status: 'active', startDate: { $lte: date }, endDate: { $gte: date } }).lean(),
    HomeAbsence.find({ homeId, startDate: { $lte: date }, endDate: { $gte: date } }).lean(),
  ]);

  const home = homes.find((h) => h.id === homeId) as unknown as HomeType;
  if (!home) return null;

  const absenceMatch = absences.find((a) => a.mealType === 'all' || true);
  const homeAbsenceInfo = {
    absent: absences.length > 0,
    reason: absenceMatch?.reason,
  };

  const calculateMeal = (mealType: MealType) => {
    const regularAssignments = assignments.filter((m) => m.homeId === homeId && m.mealType === mealType);
    const backupsToThisHome = backups.filter((b) => b.backupHomeId === homeId && b.mealType === mealType);
    const backupsAwayFromThisHome = backups.filter((b) => b.originalHomeId === homeId && b.mealType === mealType);
    const reassignedAwayStudentIds = new Set(backupsAwayFromThisHome.map((b) => b.studentId));

    const studentList: HomeDailySummary['breakfast']['students'] = [];

    for (const asgn of regularAssignments) {
      if (reassignedAwayStudentIds.has(asgn.studentId)) continue;
      const student = students.find((s) => s.id === asgn.studentId) as unknown as StudentType;
      if (student && student.status === 'active') {
        const onLeave = leaves.some(
          (l) => l.studentId === student.id && (l.mealType === 'all' || l.mealType === mealType)
        );
        studentList.push({
          student,
          isOnLeave: onLeave,
          isBackup: false,
        });
      }
    }

    for (const b of backupsToThisHome) {
      const student = students.find((s) => s.id === b.studentId) as unknown as StudentType;
      const originalHome = homes.find((h) => h.id === b.originalHomeId) as unknown as HomeType;
      if (student && student.status === 'active') {
        const onLeave = leaves.some(
          (l) => l.studentId === student.id && (l.mealType === 'all' || l.mealType === mealType)
        );
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

export async function getAllHomesDailySummary(date: string): Promise<HomeDailySummary[]> {
  await ensureSeedData();
  const homes = await Home.find({}).lean();
  const summaries = await Promise.all(homes.map((h) => getHomeDailySummary(h.id, date)));
  return summaries.filter((s): s is HomeDailySummary => s !== null);
}

export async function getStudentDailySchedule(studentId: string, date: string): Promise<StudentDailySchedule | null> {
  await ensureSeedData();
  const [student, homes, assignments, backups, leaves, absences] = await Promise.all([
    Student.findOne({ id: studentId }).lean(),
    Home.find({}).lean(),
    MealAssignment.find({ studentId, isActive: true }).lean(),
    BackupAssignment.find({ studentId, date }).lean(),
    StudentLeave.find({ studentId, status: 'active', startDate: { $lte: date }, endDate: { $gte: date } }).lean(),
    HomeAbsence.find({ startDate: { $lte: date }, endDate: { $gte: date } }).lean(),
  ]);

  if (!student) return null;

  const buildMealSchedule = (mealType: MealType) => {
    const regularAsgn = assignments.find((m) => m.mealType === mealType);
    const regularHome = regularAsgn ? (homes.find((h) => h.id === regularAsgn.homeId) as unknown as HomeType) : undefined;
    const isHostAbsent = regularHome
      ? absences.some((a) => a.homeId === regularHome.id && (a.mealType === 'all' || a.mealType === mealType))
      : false;

    const backupAsgn = backups.find((b) => b.mealType === mealType);
    const backupHome = backupAsgn ? (homes.find((h) => h.id === backupAsgn.backupHomeId) as unknown as HomeType) : undefined;
    const isOnLeave = leaves.some((l) => l.mealType === 'all' || l.mealType === mealType);

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
    student: student as unknown as StudentType,
    meals: {
      breakfast: buildMealSchedule('breakfast'),
      lunch: buildMealSchedule('lunch'),
      dinner: buildMealSchedule('dinner'),
    },
  };
}

