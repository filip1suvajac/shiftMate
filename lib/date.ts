import { Shift } from "@/lib/types";

export function formatMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function parseShiftDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export function getShiftHours(shift: Pick<Shift, "date" | "startTime" | "endTime">) {
  const start = parseShiftDateTime(shift.date, shift.startTime);
  const end = parseShiftDateTime(shift.date, shift.endTime);
  return Math.max(0, (end.getTime() - start.getTime()) / 36e5);
}

export function isCurrentMonth(date: string) {
  return date.startsWith(formatMonthKey());
}

export function formatFriendlyDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}

export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}
