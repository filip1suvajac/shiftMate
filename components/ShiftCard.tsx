import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { formatFriendlyDate, formatMoney, getShiftHours } from "@/lib/date";
import { Shift } from "@/lib/types";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  shift: Shift;
  currency: string;
  onPress?: () => void;
};

export function ShiftCard({ shift, currency, onPress }: Props) {
  const { colors } = useAppTheme();
  const hours = getShiftHours(shift);
  const content = (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.grow}>
          <AppText variant="heading">{shift.company}</AppText>
          <AppText variant="muted">{shift.role}</AppText>
        </View>
        <AppText style={{ color: colors.primary, fontWeight: "800" }}>{formatMoney(hours * shift.hourlyRate, currency)}</AppText>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.muted} />
        <AppText variant="muted">{formatFriendlyDate(shift.date)}</AppText>
        <AppText variant="muted">•</AppText>
        <AppText variant="muted">
          {shift.startTime}-{shift.endTime}
        </AppText>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={16} color={colors.muted} />
        <AppText variant="muted">{hours.toFixed(1)} hours</AppText>
        <AppText variant="muted">•</AppText>
        <AppText variant="muted">{formatMoney(shift.hourlyRate, currency)}/hr</AppText>
      </View>
      {shift.notes ? <AppText variant="muted">{shift.notes}</AppText> : null}
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}

const styles = StyleSheet.create({
  card: {
    gap: 9
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  grow: {
    flex: 1
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flexWrap: "wrap"
  }
});
