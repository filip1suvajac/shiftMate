import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { formatMoney } from "@/lib/date";
import { getSettings, getStatistics } from "@/lib/db";
import { CompanyHours, MonthlySummary } from "@/lib/types";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function StatisticsScreen() {
  const { colors } = useAppTheme();
  const [currency, setCurrency] = useState("EUR");
  const [monthly, setMonthly] = useState<MonthlySummary[]>([]);
  const [companyHours, setCompanyHours] = useState<CompanyHours[]>([]);
  const [averageHourlyRate, setAverageHourlyRate] = useState(0);

  const load = useCallback(async () => {
    const [stats, settings] = await Promise.all([getStatistics(), getSettings()]);
    setMonthly(stats.monthly);
    setCompanyHours(stats.companyHours);
    setAverageHourlyRate(stats.averageHourlyRate);
    setCurrency(settings.currency);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const maxCompanyHours = Math.max(...companyHours.map((item) => item.hours), 1);

  return (
    <Screen>
      <View>
        <AppText variant="title">Statistics</AppText>
        <AppText variant="muted">Earnings, company totals, and average rate</AppText>
      </View>

      <Card muted>
        <AppText variant="label" style={{ color: colors.primary }}>
          Average hourly rate
        </AppText>
        <AppText variant="metric">{formatMoney(averageHourlyRate, currency)}</AppText>
      </Card>

      <View style={styles.section}>
        <AppText variant="heading">Monthly earnings</AppText>
        {monthly.length ? (
          monthly.map((item) => (
            <Card key={item.month}>
              <View style={styles.row}>
                <View>
                  <AppText variant="heading">{item.month}</AppText>
                  <AppText variant="muted">
                    {item.hours.toFixed(1)} hours • {item.shifts} shifts
                  </AppText>
                </View>
                <AppText style={{ fontWeight: "800", color: colors.primary }}>{formatMoney(item.earnings, currency)}</AppText>
              </View>
            </Card>
          ))
        ) : (
          <EmptyState title="No statistics" message="Stats appear after you add shifts." icon="stats-chart-outline" />
        )}
      </View>

      <View style={styles.section}>
        <AppText variant="heading">Hours by company</AppText>
        {companyHours.map((item) => (
          <Card key={item.company}>
            <View style={styles.row}>
              <AppText style={styles.companyName}>{item.company}</AppText>
              <AppText variant="muted">{item.hours.toFixed(1)}h</AppText>
            </View>
            <View style={[styles.barTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.max(8, (item.hours / maxCompanyHours) * 100)}%`
                  }
                ]}
              />
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  companyName: {
    flex: 1,
    fontWeight: "700"
  },
  barTrack: {
    height: 9,
    borderRadius: 8,
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    borderRadius: 8
  }
});
