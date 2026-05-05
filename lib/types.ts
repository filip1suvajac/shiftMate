export type Shift = {
  id: number;
  company: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  notes: string;
  createdAt: string;
};

export type ShiftInput = Omit<Shift, "id" | "createdAt">;

export type Settings = {
  currency: string;
};

export type CompanyHours = {
  company: string;
  hours: number;
};

export type MonthlySummary = {
  month: string;
  hours: number;
  earnings: number;
  shifts: number;
};
