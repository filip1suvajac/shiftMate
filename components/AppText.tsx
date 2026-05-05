import { Text, TextProps, StyleSheet, TextStyle } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = TextProps & {
  variant?: "title" | "heading" | "body" | "muted" | "label" | "metric";
};

export function AppText({ variant = "body", style, ...props }: Props) {
  const { colors } = useAppTheme();
  const variantStyle = styles[variant] as TextStyle;
  return <Text {...props} style={[styles.base, { color: colors.text }, variantStyle, variant === "muted" && { color: colors.muted }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 22
  },
  title: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "800"
  },
  heading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700"
  },
  body: {
    fontSize: 16
  },
  muted: {
    fontSize: 14
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  metric: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800"
  }
});
