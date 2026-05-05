import { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Shift, ShiftInput } from "@/lib/types";
import { parseShiftDateTime, todayInputValue } from "@/lib/date";

type Props = {
  initialShift?: Shift | null;
  onSubmit: (input: ShiftInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitLabel: string;
};

type Errors = Partial<Record<keyof ShiftInput | "time", string>>;

export function ShiftForm({ initialShift, onSubmit, onDelete, submitLabel }: Props) {
  const [company, setCompany] = useState(initialShift?.company ?? "");
  const [role, setRole] = useState(initialShift?.role ?? "");
  const [date, setDate] = useState(initialShift?.date ?? todayInputValue());
  const [startTime, setStartTime] = useState(initialShift?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(initialShift?.endTime ?? "13:00");
  const [hourlyRate, setHourlyRate] = useState(String(initialShift?.hourlyRate ?? ""));
  const [notes, setNotes] = useState(initialShift?.notes ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const input = useMemo<ShiftInput>(
    () => ({
      company: company.trim(),
      role: role.trim(),
      date: date.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      hourlyRate: Number(hourlyRate),
      notes: notes.trim()
    }),
    [company, role, date, startTime, endTime, hourlyRate, notes]
  );

  function validate() {
    const nextErrors: Errors = {};
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^\d{2}:\d{2}$/;

    if (!input.company) nextErrors.company = "Company is required.";
    if (!input.role) nextErrors.role = "Role is required.";
    if (!datePattern.test(input.date)) nextErrors.date = "Use YYYY-MM-DD.";
    if (!timePattern.test(input.startTime)) nextErrors.startTime = "Use HH:mm.";
    if (!timePattern.test(input.endTime)) nextErrors.endTime = "Use HH:mm.";
    if (!Number.isFinite(input.hourlyRate) || input.hourlyRate <= 0) {
      nextErrors.hourlyRate = "Hourly rate must be positive.";
    }

    if (!nextErrors.date && !nextErrors.startTime && !nextErrors.endTime) {
      const start = parseShiftDateTime(input.date, input.startTime);
      const end = parseShiftDateTime(input.date, input.endTime);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        nextErrors.time = "End time must be after start time.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit(input);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!onDelete) return;
    Alert.alert("Delete shift", "This shift will be permanently removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void onDelete();
        }
      }
    ]);
  }

  return (
    <View style={styles.form}>
      <Input label="Company" value={company} onChangeText={setCompany} placeholder="Campus Cafe" error={errors.company} />
      <Input label="Role" value={role} onChangeText={setRole} placeholder="Barista" error={errors.role} />
      <Input label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" error={errors.date} />
      <View style={styles.timeRow}>
        <View style={styles.timeField}>
          <Input label="Start" value={startTime} onChangeText={setStartTime} placeholder="09:00" error={errors.startTime} />
        </View>
        <View style={styles.timeField}>
          <Input label="End" value={endTime} onChangeText={setEndTime} placeholder="13:00" error={errors.endTime ?? errors.time} />
        </View>
      </View>
      <Input
        label="Hourly rate"
        value={hourlyRate}
        onChangeText={setHourlyRate}
        placeholder="10.50"
        keyboardType="decimal-pad"
        error={errors.hourlyRate}
      />
      <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" multiline />
      <Button label={submitLabel} icon="checkmark-circle-outline" onPress={handleSubmit} disabled={saving} />
      {onDelete ? <Button label="Delete shift" icon="trash-outline" variant="danger" onPress={confirmDelete} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 15
  },
  timeRow: {
    flexDirection: "row",
    gap: 12
  },
  timeField: {
    flex: 1
  }
});
