import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "@/lib/theme";

export function useAppTheme() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  return { colors, scheme: scheme ?? "light" };
}
