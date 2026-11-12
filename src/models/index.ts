import mongoose, { Schema, Document, Model } from 'mongoose';
import { Role, MealType, LeaveMealType } from '@/types';

// -------------------------------------------------------------
// User Model
// -------------------------------------------------------------
export interface IUser extends Document {
  id: string;
  userId: string;
  password: string;
  role: Role;
  name: string;
  phone: string;
  createdAt: string;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'student', 'host'] },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// Student Model
// -------------------------------------------------------------
export interface IStudent extends Document {
  id: string;
  userId: string;
  name: string;
  phone: string;
  roomNo: string;
  hostelBlock?: string;
  emergencyContact?: string;
  status: 'active' | 'inactive';
  notes?: string;
}

const StudentSchema = new Schema<IStudent>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    roomNo: { type: String, required: true },
    hostelBlock: { type: String },
    emergencyContact: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// Home Model
// -------------------------------------------------------------
export interface IHome extends Document {
  id: string;
  userId: string;
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

const HomeSchema = new Schema<IHome>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    hostName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, required: true },
    breakfastCapacity: { type: Number, default: 4 },
    lunchCapacity: { type: Number, default: 4 },
    dinnerCapacity: { type: Number, default: 4 },
    googleMapsUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// MealAssignment Model
// -------------------------------------------------------------
export interface IMealAssignment extends Document {
  id: string;
  studentId: string;
  mealType: MealType;
  homeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

const MealAssignmentSchema = new Schema<IMealAssignment>(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    mealType: { type: String, required: true, enum: ['breakfast', 'lunch', 'dinner'] },
    homeId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// HomeAbsence Model
// -------------------------------------------------------------
export interface IHomeAbsence extends Document {
  id: string;
  homeId: string;
  startDate: string;
  endDate: string;
  mealType: LeaveMealType;
  reason?: string;
  createdAt: string;
}

const HomeAbsenceSchema = new Schema<IHomeAbsence>(
  {
    id: { type: String, required: true, unique: true },
    homeId: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    mealType: { type: String, default: 'all' },
    reason: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// StudentLeave Model
// -------------------------------------------------------------
export interface IStudentLeave extends Document {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  mealType: LeaveMealType;
  reason?: string;
  status: 'active' | 'cancelled';
  createdAt: string;
}

const StudentLeaveSchema = new Schema<IStudentLeave>(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    mealType: { type: String, default: 'all' },
    reason: { type: String },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// BackupAssignment Model
// -------------------------------------------------------------
export interface IBackupAssignment extends Document {
  id: string;
  studentId: string;
  originalHomeId: string;
  backupHomeId: string;
  date: string;
  mealType: MealType;
  reason?: string;
  createdAt: string;
}

const BackupAssignmentSchema = new Schema<IBackupAssignment>(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    originalHomeId: { type: String, required: true },
    backupHomeId: { type: String, required: true },
    date: { type: String, required: true },
    mealType: { type: String, required: true, enum: ['breakfast', 'lunch', 'dinner'] },
    reason: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

// Export models with cache check to prevent re-compilation errors during Next.js reloads
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export const Home: Model<IHome> = mongoose.models.Home || mongoose.model<IHome>('Home', HomeSchema);
export const MealAssignment: Model<IMealAssignment> = mongoose.models.MealAssignment || mongoose.model<IMealAssignment>('MealAssignment', MealAssignmentSchema);
export const HomeAbsence: Model<IHomeAbsence> = mongoose.models.HomeAbsence || mongoose.model<IHomeAbsence>('HomeAbsence', HomeAbsenceSchema);
export const StudentLeave: Model<IStudentLeave> = mongoose.models.StudentLeave || mongoose.model<IStudentLeave>('StudentLeave', StudentLeaveSchema);
export const BackupAssignment: Model<IBackupAssignment> = mongoose.models.BackupAssignment || mongoose.model<IBackupAssignment>('BackupAssignment', BackupAssignmentSchema);

