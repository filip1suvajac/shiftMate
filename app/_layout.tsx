import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { initDatabase } from "@/lib/db";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const { colors, scheme } = useAppTheme();

  useEffect(() => {
    initDatabase().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="shift/new"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Add shift",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text
          }}
        />
        <Stack.Screen
          name="shift/[id]"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Edit shift",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text
          }}
        />
      </Stack>
    </>
  );
}
