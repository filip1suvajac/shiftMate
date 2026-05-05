import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = ViewProps & {
  children: ReactNode;
  muted?: boolean;
};

export function Card({ children, muted = false, style, ...props }: Props) {
  const { colors } = useAppTheme();
  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: muted ? colors.surfaceMuted : colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 10,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  }
});
