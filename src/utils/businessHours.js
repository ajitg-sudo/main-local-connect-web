export const WEEKDAYS = [
  { key: "mon", label: "Mon", full: "Monday" },
  { key: "tue", label: "Tue", full: "Tuesday" },
  { key: "wed", label: "Wed", full: "Wednesday" },
  { key: "thu", label: "Thu", full: "Thursday" },
  { key: "fri", label: "Fri", full: "Friday" },
  { key: "sat", label: "Sat", full: "Saturday" },
  { key: "sun", label: "Sun", full: "Sunday" }
];

const DAY_KEYS = WEEKDAYS.map((d) => d.key);

export function defaultSchedule() {
  return {
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
    openTime: "09:00",
    closeTime: "20:00"
  };
}

function emptyDays() {
  return Object.fromEntries(DAY_KEYS.map((k) => [k, false]));
}

export function formatTime12h(time24) {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = Number(hStr);
  const m = mStr || "00";
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
}

function to24h(hour, minute, period) {
  let h = Number(hour);
  const p = (period || "").toLowerCase();
  if (p === "pm" && h < 12) h += 12;
  if (p === "am" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(minute || "00").padStart(2, "0")}`;
}

function groupDayRanges(selectedKeys) {
  const indices = WEEKDAYS.map((d, i) => (selectedKeys.includes(d.key) ? i : -1)).filter((i) => i >= 0);
  if (!indices.length) return [];

  const groups = [];
  let start = indices[0];
  let prev = indices[0];

  for (let i = 1; i <= indices.length; i += 1) {
    const cur = indices[i];
    if (cur === prev + 1) {
      prev = cur;
      continue;
    }
    groups.push([start, prev]);
    start = cur;
    prev = cur;
  }
  return groups;
}

export function scheduleToString(schedule) {
  const selected = DAY_KEYS.filter((k) => schedule.days[k]);
  if (!selected.length) return "";

  const open = formatTime12h(schedule.openTime);
  const close = formatTime12h(schedule.closeTime);
  const timePart = `${open} – ${close}`;

  const groups = groupDayRanges(selected);
  const dayPart = groups
    .map(([start, end]) => {
      if (start === end) return WEEKDAYS[start].label;
      return `${WEEKDAYS[start].label}–${WEEKDAYS[end].label}`;
    })
    .join(", ");

  const closed = DAY_KEYS.filter((k) => !schedule.days[k]);
  let result = `${dayPart} ${timePart}`;
  if (closed.length && closed.length < 7) {
    const closedGroups = groupDayRanges(closed);
    const closedPart = closedGroups
      .map(([start, end]) => (start === end ? WEEKDAYS[start].label : `${WEEKDAYS[start].label}–${WEEKDAYS[end].label}`))
      .join(", ");
    result += `, ${closedPart} closed`;
  }
  return result;
}

export function stringToSchedule(str) {
  if (!str?.trim()) return null;

  const days = emptyDays();
  const lower = str.toLowerCase();

  if (/mon\s*[-–]\s*sun/i.test(str)) {
    DAY_KEYS.forEach((k) => { days[k] = true; });
  } else if (/mon\s*[-–]\s*sat/i.test(str)) {
    ["mon", "tue", "wed", "thu", "fri", "sat"].forEach((k) => { days[k] = true; });
  } else if (/mon\s*[-–]\s*fri/i.test(str)) {
    ["mon", "tue", "wed", "thu", "fri"].forEach((k) => { days[k] = true; });
  } else {
    const aliases = {
      mon: "mon", monday: "mon",
      tue: "tue", tuesday: "tue",
      wed: "wed", wednesday: "wed",
      thu: "thu", thursday: "thu",
      fri: "fri", friday: "fri",
      sat: "sat", saturday: "sat",
      sun: "sun", sunday: "sun"
    };
    Object.entries(aliases).forEach(([alias, key]) => {
      if (lower.includes(alias)) days[key] = true;
    });
  }

  if (!DAY_KEYS.some((k) => days[k])) {
    ["mon", "tue", "wed", "thu", "fri", "sat"].forEach((k) => { days[k] = true; });
  }

  const timeMatch = str.match(
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[-–]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i
  );

  let openTime = "09:00";
  let closeTime = "20:00";
  if (timeMatch) {
    openTime = to24h(timeMatch[1], timeMatch[2], timeMatch[3] || (Number(timeMatch[1]) < 12 ? "am" : "pm"));
    closeTime = to24h(timeMatch[4], timeMatch[5], timeMatch[6] || (Number(timeMatch[4]) < 12 ? "pm" : "pm"));
  }

  return { days, openTime, closeTime };
}

export function isValidHours(str) {
  const schedule = stringToSchedule(str);
  return Boolean(schedule && DAY_KEYS.some((k) => schedule.days[k]));
}

export const HOURS_PRESETS = {
  weekdays: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
  monSat: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
  all: Object.fromEntries(DAY_KEYS.map((k) => [k, true]))
};
