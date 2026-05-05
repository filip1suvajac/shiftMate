import * as SQLite from "expo-sqlite";
import { CompanyHours, MonthlySummary, Settings, Shift, ShiftInput } from "@/lib/types";
import { formatMonthKey, getShiftHours } from "@/lib/date";

const dbPromise = SQLite.openDatabaseAsync("shiftmate.db");

async function db() {
  return dbPromise;
}

export async function initDatabase() {
  const database = await db();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      date TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      hourlyRate REAL NOT NULL,
      notes TEXT DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  const currency = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'currency'"
  );
  if (!currency) {
    await database.runAsync("INSERT INTO settings (key, value) VALUES ('currency', 'EUR')");
  }

  const seeded = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'seeded'"
  );
  if (!seeded) {
    await seedDemoData();
    await database.runAsync("INSERT INTO app_meta (key, value) VALUES ('seeded', 'true')");
  }
}

async function seedDemoData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const previous = new Date(year, now.getMonth() - 1, 22);
  const day = String(Math.min(now.getDate() + 2, 27)).padStart(2, "0");
  const demo: ShiftInput[] = [
    {
      company: "Campus Cafe",
      role: "Barista",
      date: `${year}-${month}-03`,
      startTime: "08:00",
      endTime: "13:30",
      hourlyRate: 9.5,
      notes: "Morning rush shift"
    },
    {
      company: "Library Helpdesk",
      role: "Assistant",
      date: `${year}-${month}-12`,
      startTime: "15:00",
      endTime: "20:00",
      hourlyRate: 10.25,
      notes: "Return cart and desk coverage"
    },
    {
      company: "Event Crew",
      role: "Usher",
      date: `${year}-${month}-${day}`,
      startTime: "17:30",
      endTime: "22:00",
      hourlyRate: 12,
      notes: "Student theater opening night"
    },
    {
      company: "Campus Cafe",
      role: "Barista",
      date: previous.toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "14:00",
      hourlyRate: 9.5,
      notes: "Previous month sample"
    }
  ];

  for (const shift of demo) {
    await createShift(shift);
  }
}

function mapShift(row: any): Shift {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    hourlyRate: Number(row.hourlyRate),
    notes: row.notes ?? "",
    createdAt: row.createdAt
  };
}

export async function getAllShifts() {
  const database = await db();
  const rows = await database.getAllAsync("SELECT * FROM shifts ORDER BY date ASC, startTime ASC");
  return rows.map(mapShift);
}

export async function getShift(id: number) {
  const database = await db();
  const row = await database.getFirstAsync("SELECT * FROM shifts WHERE id = ?", [id]);
  return row ? mapShift(row) : null;
}

export async function createShift(input: ShiftInput) {
  const database = await db();
  await database.runAsync(
    `INSERT INTO shifts (company, role, date, startTime, endTime, hourlyRate, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [input.company, input.role, input.date, input.startTime, input.endTime, input.hourlyRate, input.notes]
  );
}

export async function updateShift(id: number, input: ShiftInput) {
  const database = await db();
  await database.runAsync(
    `UPDATE shifts
     SET company = ?, role = ?, date = ?, startTime = ?, endTime = ?, hourlyRate = ?, notes = ?
     WHERE id = ?`,
    [input.company, input.role, input.date, input.startTime, input.endTime, input.hourlyRate, input.notes, id]
  );
}

export async function deleteShift(id: number) {
  const database = await db();
  await database.runAsync("DELETE FROM shifts WHERE id = ?", [id]);
}

export async function clearAllData() {
  const database = await db();
  await database.runAsync("DELETE FROM shifts");
  await database.runAsync("UPDATE app_meta SET value = 'true' WHERE key = 'seeded'");
}

export async function getSettings(): Promise<Settings> {
  const database = await db();
  const row = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'currency'"
  );
  return { currency: row?.value ?? "EUR" };
}

export async function updateCurrency(currency: string) {
  const database = await db();
  await database.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES ('currency', ?)",
    [currency]
  );
}

export async function getDashboardData() {
  const shifts = await getAllShifts();
  const current = shifts.filter((shift) => shift.date.startsWith(formatMonthKey()));
  const today = new Date();
  const nextShift = shifts.find((shift) => new Date(`${shift.date}T${shift.startTime}:00`) >= today) ?? null;
  const hours = current.reduce((sum, shift) => sum + getShiftHours(shift), 0);
  const earnings = current.reduce((sum, shift) => sum + getShiftHours(shift) * shift.hourlyRate, 0);
  return {
    totalHours: hours,
    estimatedEarnings: earnings,
    shiftCount: current.length,
    nextShift
  };
}

export async function getStatistics() {
  const shifts = await getAllShifts();
  const summaries = new Map<string, MonthlySummary>();
  const companyHours = new Map<string, number>();
  let rateTotal = 0;

  for (const shift of shifts) {
    const hours = getShiftHours(shift);
    const earnings = hours * shift.hourlyRate;
    const month = shift.date.slice(0, 7);
    const summary = summaries.get(month) ?? { month, hours: 0, earnings: 0, shifts: 0 };
    summary.hours += hours;
    summary.earnings += earnings;
    summary.shifts += 1;
    summaries.set(month, summary);
    companyHours.set(shift.company, (companyHours.get(shift.company) ?? 0) + hours);
    rateTotal += shift.hourlyRate;
  }

  return {
    monthly: Array.from(summaries.values()).sort((a, b) => b.month.localeCompare(a.month)),
    companyHours: Array.from(companyHours.entries())
      .map(([company, hours]): CompanyHours => ({ company, hours }))
      .sort((a, b) => b.hours - a.hours),
    averageHourlyRate: shifts.length ? rateTotal / shifts.length : 0
  };
}
