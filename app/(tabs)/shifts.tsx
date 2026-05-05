import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { ShiftCard } from "@/components/ShiftCard";
import { getAllShifts, getSettings } from "@/lib/db";
import { Shift } from "@/lib/types";

export default function ShiftsScreen() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currency, setCurrency] = useState("EUR");

  const load = useCallback(async () => {
    const [allShifts, settings] = await Promise.all([getAllShifts(), getSettings()]);
    setShifts(allShifts);
    setCurrency(settings.currency);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="title">Shifts</AppText>
          <AppText variant="muted">All shifts sorted by date</AppText>
        </View>
        <Button label="Add" icon="add-outline" onPress={() => router.push("/shift/new")} style={styles.addButton} />
      </View>

      {shifts.length ? (
        <View style={styles.list}>
          {shifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} currency={currency} onPress={() => router.push(`/shift/${shift.id}`)} />
          ))}
        </View>
      ) : (
        <EmptyState title="No shifts yet" message="Create your first shift to start tracking hours and earnings." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  headerText: {
    flex: 1
  },
  addButton: {
    minHeight: 42,
    paddingHorizontal: 14
  },
  list: {
    gap: 12
  }
});
