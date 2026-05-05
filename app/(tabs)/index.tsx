import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { ShiftCard } from "@/components/ShiftCard";
import { formatMoney } from "@/lib/date";
import { getDashboardData, getSettings } from "@/lib/db";
import { Shift } from "@/lib/types";
import { useAppTheme } from "@/hooks/useAppTheme";

type DashboardData = {
  totalHours: number;
  estimatedEarnings: number;
  shiftCount: number;
  nextShift: Shift | null;
};

export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const [currency, setCurrency] = useState("EUR");
  const [data, setData] = useState<DashboardData>({
    totalHours: 0,
    estimatedEarnings: 0,
    shiftCount: 0,
    nextShift: null
  });

  const load = useCallback(async () => {
    const [dashboard, settings] = await Promise.all([getDashboardData(), getSettings()]);
    setData(dashboard);
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
          <AppText variant="muted">This month</AppText>
          <AppText variant="title">ShiftMate</AppText>
        </View>
        <Button label="Add" icon="add-outline" onPress={() => router.push("/shift/new")} style={styles.addButton} />
      </View>

      <Card muted style={styles.hero}>
        <AppText variant="label" style={{ color: colors.primary }}>
          Estimated earnings
        </AppText>
        <AppText variant="metric">{formatMoney(data.estimatedEarnings, currency)}</AppText>
        <AppText variant="muted">{data.totalHours.toFixed(1)} tracked hours this month</AppText>
      </Card>

      <View style={styles.metrics}>
        <Card style={styles.metricCard}>
          <AppText variant="metric">{data.totalHours.toFixed(1)}</AppText>
          <AppText variant="muted">Hours</AppText>
        </Card>
        <Card style={styles.metricCard}>
          <AppText variant="metric">{data.shiftCount}</AppText>
          <AppText variant="muted">Shifts</AppText>
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <AppText variant="heading">Next shift</AppText>
      </View>
      {data.nextShift ? (
        <ShiftCard shift={data.nextShift} currency={currency} onPress={() => router.push(`/shift/${data.nextShift?.id}`)} />
      ) : (
        <EmptyState title="No upcoming shifts" message="Add your next work shift to keep the month planned." />
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
  hero: {
    paddingVertical: 20
  },
  metrics: {
    flexDirection: "row",
    gap: 12
  },
  metricCard: {
    flex: 1
  },
  sectionHeader: {
    marginTop: 2
  }
});
