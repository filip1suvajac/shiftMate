import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { clearAllData, getSettings, updateCurrency } from "@/lib/db";
import { useAppTheme } from "@/hooks/useAppTheme";

const currencies = ["EUR", "USD", "GBP", "CAD", "AUD"];

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const [currency, setCurrency] = useState("EUR");

  const load = useCallback(async () => {
    const settings = await getSettings();
    setCurrency(settings.currency);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  async function chooseCurrency(nextCurrency: string) {
    setCurrency(nextCurrency);
    await updateCurrency(nextCurrency);
  }

  function confirmClear() {
    Alert.alert("Clear all data", "All saved shifts will be deleted. Settings will be kept.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          void clearAllData();
        }
      }
    ]);
  }

  return (
    <Screen>
      <View>
        <AppText variant="title">Settings</AppText>
        <AppText variant="muted">Local preferences for ShiftMate</AppText>
      </View>

      <Card>
        <AppText variant="heading">Currency</AppText>
        <View style={styles.currencyGrid}>
          {currencies.map((item) => {
            const selected = item === currency;
            return (
              <Pressable
                key={item}
                onPress={() => void chooseCurrency(item)}
                style={({ pressed }) => [
                  styles.currency,
                  {
                    backgroundColor: selected ? colors.primary : colors.surfaceMuted,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: pressed ? 0.75 : 1
                  }
                ]}
              >
                <AppText style={{ color: selected ? colors.primaryText : colors.text, fontWeight: "800" }}>{item}</AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <AppText variant="heading">Data</AppText>
        <AppText variant="muted">ShiftMate stores everything locally on this device with SQLite.</AppText>
        <Button label="Clear all data" icon="trash-outline" variant="danger" onPress={confirmClear} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  currencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  currency: {
    minWidth: 70,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14
  }
});
