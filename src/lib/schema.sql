-- ============================================================================
-- STUDENT MEAL & HOST HOME TRACKER (DARS MEAL MANAGEMENT SYSTEM)
-- PostgreSQL / Supabase Database Schema
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'student', 'host');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_meal_type AS ENUM ('all', 'breakfast', 'lunch', 'dinner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_type AS ENUM ('active', 'inactive', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS TABLE
-- Unified login table using unique alphanumeric user IDs (e.g. ADM01, STU101, HOM201)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,      -- e.g. ADM01, STU101, HOM201
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4. STUDENTS TABLE
-- Profile metadata for enrolled students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    room_no VARCHAR(50) NOT NULL,
    hostel_block VARCHAR(50),
    emergency_contact VARCHAR(30),
    status status_type DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- 5. HOMES TABLE (HOST HOMES)
-- Local host home families that prepare food for students
CREATE TABLE IF NOT EXISTS homes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    host_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    landmark VARCHAR(200) NOT NULL,
    breakfast_capacity INTEGER NOT NULL DEFAULT 4,
    lunch_capacity INTEGER NOT NULL DEFAULT 4,
    dinner_capacity INTEGER NOT NULL DEFAULT 4,
    google_maps_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_homes_user_id ON homes(user_id);

-- 6. MEAL ASSIGNMENTS TABLE (ASSIGNMENT MATRIX)
-- Maps each student to a specific host home for Breakfast, Lunch, and Dinner.
-- Note: A student can eat Breakfast at Home A, Lunch at Home B, and Dinner at Home C.
CREATE TABLE IF NOT EXISTS meal_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    meal_type meal_type NOT NULL,
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- A student can have only ONE active home assignment per meal type
    CONSTRAINT unique_active_student_meal UNIQUE(student_id, meal_type)
);

CREATE INDEX IF NOT EXISTS idx_meal_assignments_student ON meal_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_meal_assignments_home ON meal_assignments(home_id);
CREATE INDEX IF NOT EXISTS idx_meal_assignments_meal_type ON meal_assignments(meal_type);

-- 7. HOME ABSENCES TABLE (HOST UNAVAILABILITY)
-- Recorded when a host home marks themselves unavailable / closed for dates.
CREATE TABLE IF NOT EXISTS home_absences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    meal_type leave_meal_type DEFAULT 'all',  -- 'all', 'breakfast', 'lunch', 'dinner'
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_home_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_home_absences_home ON home_absences(home_id);
CREATE INDEX IF NOT EXISTS idx_home_absences_dates ON home_absences(start_date, end_date);

-- 8. STUDENT LEAVES TABLE
-- Recorded when a student takes leave for a single meal, full day, or date range.
CREATE TABLE IF NOT EXISTS student_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    meal_type leave_meal_type DEFAULT 'all',  -- 'all', 'breakfast', 'lunch', 'dinner'
    reason TEXT,
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_student_leave_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_student_leaves_student ON student_leaves(student_id);
CREATE INDEX IF NOT EXISTS idx_student_leaves_dates ON student_leaves(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_student_leaves_status ON student_leaves(status);

-- 9. BACKUP ASSIGNMENTS TABLE (ADMIN REASSIGNMENTS)
-- Recorded when Admin reassigns an affected student to a temporary backup home
-- due to their regular host home being absent on a specific date.
CREATE TABLE IF NOT EXISTS backup_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    original_home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    backup_home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type meal_type NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_backup_date_meal UNIQUE (student_id, date, meal_type)
);

CREATE INDEX IF NOT EXISTS idx_backup_assignments_date ON backup_assignments(date);
CREATE INDEX IF NOT EXISTS idx_backup_assignments_student ON backup_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_backup_assignments_backup_home ON backup_assignments(backup_home_id);

-- ============================================================================
-- HELPER VIEWS & QUERIES
-- ============================================================================

-- View: Active student meal assignments with home details
CREATE OR REPLACE VIEW view_active_assignments AS
SELECT 
    ma.id AS assignment_id,
    s.id AS student_id,
    s.user_id AS student_user_id,
    s.name AS student_name,
    s.phone AS student_phone,
    s.room_no,
    ma.meal_type,
    h.id AS home_id,
    h.user_id AS home_user_id,
    h.host_name,
    h.phone AS host_phone,
    h.address,
    h.landmark,
    ma.is_active
FROM meal_assignments ma
JOIN students s ON ma.student_id = s.id
JOIN homes h ON ma.home_id = h.id
WHERE ma.is_active = TRUE;

