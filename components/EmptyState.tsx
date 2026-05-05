import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function EmptyState({ title, message, icon = "calendar-outline" }: Props) {
  const { colors } = useAppTheme();
  return (
    <Card muted>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={26} color={colors.primary} />
      </View>
      <AppText variant="heading">{title}</AppText>
      <AppText variant="muted">{message}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center"
  }
});
