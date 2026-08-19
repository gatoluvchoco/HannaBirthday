/**
 * Dual Timezone & Birthday Countdown Utility
 * Birmingham UK (Europe/London, BST = UTC+1 in August)
 * Malaysia (Asia/Kuala_Lumpur, MYT = UTC+8)
 */

export interface TimezoneStatus {
  birminghamTimeStr: string;
  birminghamDateStr: string;
  malaysiaTimeStr: string;
  malaysiaDateStr: string;
  targetDateStr: string;
  isUnlocked: boolean;
  totalMsRemaining: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates the exact UTC timestamp for August 20th 00:00:00 (Midnight) Birmingham UK time.
 * In August, Birmingham is in British Summer Time (BST = UTC+1).
 * Therefore, August 20 00:00:00 BST = August 19 23:00:00 UTC.
 */
export function getBirminghamBirthdayTarget(customYear?: number): number {
  const now = new Date();
  const year = customYear || now.getFullYear();
  // Month is 0-indexed: 7 is August.
  // 19 August 23:00:00 UTC == 20 August 00:00:00 BST
  const targetUTC = Date.UTC(year, 7, 19, 23, 0, 0, 0);
  return targetUTC;
}

/**
 * Calculates live time and countdown statistics
 */
export function getTimezoneCountdown(simulatedTargetMs?: number): TimezoneStatus {
  const now = new Date();
  const nowMs = now.getTime();
  const targetMs = simulatedTargetMs || getBirminghamBirthdayTarget();

  const totalMsRemaining = Math.max(0, targetMs - nowMs);
  const isUnlocked = totalMsRemaining <= 0;

  const seconds = Math.floor((totalMsRemaining / 1000) % 60);
  const minutes = Math.floor((totalMsRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((totalMsRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMsRemaining / (1000 * 60 * 60 * 24));

  // Format Birmingham Live Time (Europe/London)
  const birminghamTimeStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(now);

  const birminghamDateStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(now);

  // Format Malaysia Live Time (Asia/Kuala_Lumpur)
  const malaysiaTimeStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(now);

  const malaysiaDateStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(now);

  return {
    birminghamTimeStr,
    birminghamDateStr,
    malaysiaTimeStr,
    malaysiaDateStr,
    targetDateStr: '20 August (12:00 AM BST)',
    isUnlocked,
    totalMsRemaining,
    days,
    hours,
    minutes,
    seconds
  };
}

/**
 * Checks if the browser timezone is likely Malaysia / Afiq
 */
export function isUserInMalaysia(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (
      tz === 'Asia/Kuala_Lumpur' ||
      tz === 'Asia/Singapore' ||
      tz === 'Asia/Kuching'
    ) {
      return true;
    }
    // Also check UTC+8 offset in minutes (-480 min)
    const offset = new Date().getTimezoneOffset();
    if (offset === -480) {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}
