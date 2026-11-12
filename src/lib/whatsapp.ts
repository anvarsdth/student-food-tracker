/**
 * WhatsApp Integration Utilities & Message Generators
 * Supports both direct wa.me/ links and Meta WhatsApp Cloud API payloads
 */

export function cleanPhoneNumber(phone: string, defaultCountryCode: string = '91'): string {
  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  // If number starts with 0, replace with country code
  if (cleaned.startsWith('0')) {
    return defaultCountryCode + cleaned.slice(1);
  }
  // If number is 10 digits (typical in India/other countries without country code), prepend defaultCountryCode
  if (cleaned.length === 10) {
    return defaultCountryCode + cleaned;
  }
  return cleaned;
}

export function createWhatsAppUrl(phone: string, message: string): string {
  const normalizedPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedText}`;
}

/**
 * Message generator for when ALL assigned students are on leave for a date.
 * Smart Bulk Alert requirement.
 */
export function buildAllLeaveMessage(params: {
  hostName: string;
  date: string;
  reason?: string;
  adminName?: string;
}): string {
  const { hostName, date, reason, adminName = 'Student Meal Coordinator' } = params;
  return (
    `📢 *IMPORTANT MEAL NOTICE - ALL STUDENTS ON LEAVE*\n\n` +
    `Assalamu Alaikum / Respected *${hostName}*,\n\n` +
    `Please be informed that for *${date}*, *ALL assigned students are on leave / away*.\n\n` +
    `🚫 *Food Preparation: NOT REQUIRED*\n` +
    `Please *do NOT prepare* Breakfast, Lunch, or Dinner for this date.\n` +
    (reason ? `\n📌 *Occasion / Note:* ${reason}\n` : '') +
    `\nThank you very much for your continuous hospitality and noble support for the students!\n\n` +
    `— *${adminName}*\n_Student Meal & Host Home Tracker_`
  );
}

/**
 * Daily Meal Headcount Summary message for a Host Home.
 */
export function buildDailyMealSummaryMessage(params: {
  hostName: string;
  date: string;
  breakfastCount: number;
  breakfastStudents: string[];
  lunchCount: number;
  lunchStudents: string[];
  dinnerCount: number;
  dinnerStudents: string[];
  leaveStudents?: string[];
  backupStudents?: string[];
  adminName?: string;
}): string {
  const {
    hostName,
    date,
    breakfastCount,
    breakfastStudents,
    lunchCount,
    lunchStudents,
    dinnerCount,
    dinnerStudents,
    leaveStudents = [],
    backupStudents = [],
    adminName = 'Student Care Office',
  } = params;

  let msg = `🍽️ *Daily Meal Schedule - ${date}*\n\n` +
    `Assalamu Alaikum *${hostName}*,\n` +
    `Here is your expected student headcount for today:\n\n`;

  msg += `☕ *Breakfast:* *${breakfastCount} students*\n`;
  if (breakfastStudents.length > 0) {
    msg += `   └ [${breakfastStudents.join(', ')}]\n`;
  }

  msg += `🍛 *Lunch:* *${lunchCount} students*\n`;
  if (lunchStudents.length > 0) {
    msg += `   └ [${lunchStudents.join(', ')}]\n`;
  }

  msg += `🍲 *Dinner:* *${dinnerCount} students*\n`;
  if (dinnerStudents.length > 0) {
    msg += `   └ [${dinnerStudents.join(', ')}]\n`;
  }

  if (leaveStudents.length > 0) {
    msg += `\n🏖️ *Students On Leave (Deducted):*\n   • ${leaveStudents.join('\n   • ')}\n`;
  }

  if (backupStudents.length > 0) {
    msg += `\n🔄 *Temporary Backup Students Reassigned To You:*\n   • ${backupStudents.join('\n   • ')}\n`;
  }

  msg += `\nPlease prepare meals strictly according to the numbers above. JazakAllahu Khairan!\n\n` +
    `— *${adminName}*`;

  return msg;
}

/**
 * Message to notify Host Home and Admin when a student submits a Leave request.
 */
export function buildStudentLeaveNotification(params: {
  studentName: string;
  studentId: string;
  startDate: string;
  endDate: string;
  mealType: string;
  reason?: string;
}): string {
  const { studentName, studentId, startDate, endDate, mealType, reason } = params;
  const dateStr = startDate === endDate ? startDate : `${startDate} to ${endDate}`;
  const mealStr = mealType === 'all' ? 'All Meals (Full Day)' : mealType.toUpperCase();

  return (
    `⚠️ *Student Leave Notice*\n\n` +
    `Student *${studentName}* (ID: ${studentId}) has marked themselves *ON LEAVE*.\n\n` +
    `📅 *Date(s):* ${dateStr}\n` +
    `🍽️ *Meal Affected:* ${mealStr}\n` +
    (reason ? `📝 *Reason:* ${reason}\n` : '') +
    `\nThe expected headcount for the assigned host home(s) has been automatically updated.\n\n` +
    `_Student Meal & Host Home Tracker_`
  );
}

/**
 * Message to notify Student of a temporary backup home assignment when host is absent.
 */
export function buildBackupReassignmentNotification(params: {
  studentName: string;
  date: string;
  mealType: string;
  originalHostName: string;
  backupHostName: string;
  backupAddress: string;
  backupLandmark: string;
  backupPhone: string;
}): string {
  const {
    studentName,
    date,
    mealType,
    originalHostName,
    backupHostName,
    backupAddress,
    backupLandmark,
    backupPhone,
  } = params;

  return (
    `📢 *Meal Relocation Notice for ${studentName}*\n\n` +
    `Your regular host *${originalHostName}* is unavailable for *${mealType.toUpperCase()}* on *${date}*.\n\n` +
    `✅ *You have been assigned to a TEMPORARY BACKUP HOME:*\n` +
    `🏡 *Host Name:* ${backupHostName}\n` +
    `📍 *Address:* ${backupAddress}\n` +
    `🚩 *Landmark:* ${backupLandmark}\n` +
    `📞 *Phone / WhatsApp:* ${backupPhone}\n\n` +
    `Please reach out to the host or head there on time for your meal.\n\n` +
    `_Student Meal & Host Home Tracker_`
  );
}

