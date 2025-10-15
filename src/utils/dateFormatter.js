export const dateFormatter = (date) => {
  return date?.split("/").reverse()?.join("-");
};

export const dateFormatterForTimeZone = (date) => {
  if (!date) return null;
  return date?.split("T")[0].replaceAll("/", "-");
};

export function formatDateToDDMMYYYY(date) {
  if (!date) return null;
  const [yyyy, mm, dd] = date?.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

// Timezone offset mapping (in hours from UTC)
const TIMEZONE_OFFSETS = {
  'UTC': 0,
  'GMT': 0,
  'EST': -5,    // Eastern Standard Time
  'EDT': -4,    // Eastern Daylight Time
  'CST': -6,    // Central Standard Time
  'CDT': -5,    // Central Daylight Time
  'MST': -7,    // Mountain Standard Time
  'MDT': -6,    // Mountain Daylight Time
  'PST': -8,    // Pacific Standard Time
  'PDT': -7,    // Pacific Daylight Time
  'IST': 5.5,   // India Standard Time
  'JST': 9,     // Japan Standard Time
  'CET': 1,     // Central European Time
  'CEST': 2,    // Central European Summer Time
  'AEST': 10,   // Australian Eastern Standard Time
  'AEDT': 11,   // Australian Eastern Daylight Time
  'BST': 1,     // British Summer Time
  'MSK': 3,     // Moscow Time
  'KST': 9,     // Korea Standard Time
  'HKT': 8,     // Hong Kong Time
  'SGT': 8,     // Singapore Time
  'AWST': 8,    // Australian Western Standard Time
  'ACST': 9.5,  // Australian Central Standard Time
  'ACDT': 10.5, // Australian Central Daylight Time
  'NZST': 12,   // New Zealand Standard Time
  'NZDT': 13,   // New Zealand Daylight Time
};

// Function to convert time from any timezone to India timezone (IST)
export const convertToIST = (dateTimeString, sourceTimezone = 'UTC') => {
  if (!dateTimeString) return dateTimeString;
  
  try {
    // Parse the date string (assuming format: DD-MM-YYYY HH:MM AM/PM)
    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [time, period] = timePart.split(' ');
    const [hours, minutes] = time.split(':');
    
    // Convert to 24-hour format
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    // Get source timezone offset
    const sourceOffset = TIMEZONE_OFFSETS[sourceTimezone.toUpperCase()];
    if (sourceOffset === undefined) {
      console.warn(`Unknown timezone: ${sourceTimezone}. Using UTC as fallback.`);
      return convertToIST(dateTimeString, 'UTC');
    }
    
    // Create date object in source timezone
    const sourceDate = new Date(year, month - 1, day, hour24, parseInt(minutes));
    
    // Convert source time to UTC
    const sourceOffsetMs = sourceOffset * 60 * 60 * 1000;
    const utcTime = new Date(sourceDate.getTime() - sourceOffsetMs);
    
    // Convert UTC to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(utcTime.getTime() + istOffset);
    
    // Format back to the original format
    const istDay = istTime.getUTCDate().toString().padStart(2, '0');
    const istMonth = (istTime.getUTCMonth() + 1).toString().padStart(2, '0');
    const istYear = istTime.getUTCFullYear();
    const istHour = istTime.getUTCHours();
    const istMinute = istTime.getUTCMinutes().toString().padStart(2, '0');
    
    // Convert back to 12-hour format
    const periodIST = istHour >= 12 ? 'PM' : 'AM';
    const hour12 = istHour === 0 ? 12 : istHour > 12 ? istHour - 12 : istHour;
    
    return `${istDay}-${istMonth}-${istYear} ${hour12}:${istMinute} ${periodIST}`;
  } catch (error) {
    console.error(`Error converting ${sourceTimezone} time to IST:`, error);
    return dateTimeString; // Return original if conversion fails
  }
};

// Helper function to get available timezones
export const getAvailableTimezones = () => {
  return Object.keys(TIMEZONE_OFFSETS);
};

// Helper function to get timezone offset
export const getTimezoneOffset = (timezone) => {
  return TIMEZONE_OFFSETS[timezone.toUpperCase()];
};