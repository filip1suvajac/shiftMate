import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = PressableProps & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, icon, variant = "primary", style, disabled, ...props }: Props) {
  const { colors } = useAppTheme();
  const backgroundColor =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : variant === "secondary" ? colors.surfaceMuted : "transparent";
  const textColor = variant === "primary" || variant === "danger" ? colors.primaryText : colors.text;

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor: variant === "ghost" ? "transparent" : colors.border,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1
        },
        style
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={textColor} /> : null}
      <AppText style={[styles.label, { color: textColor }]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  label: {
    fontSize: 15,
    fontWeight: "700"
  }
});
