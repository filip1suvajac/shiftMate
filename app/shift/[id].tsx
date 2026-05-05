import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { ShiftForm } from "@/components/ShiftForm";
import { deleteShift, getShift, updateShift } from "@/lib/db";
import { Shift, ShiftInput } from "@/lib/types";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function EditShiftScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const shiftId = Number(id);
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShift(shiftId)
      .then(setShift)
      .finally(() => setLoading(false));
  }, [shiftId]);

  async function handleSubmit(input: ShiftInput) {
    await updateShift(shiftId, input);
    router.back();
  }

  async function handleDelete() {
    await deleteShift(shiftId);
    router.back();
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!shift) {
    return (
      <Screen>
        <Card>
          <AppText variant="heading">Shift not found</AppText>
          <AppText variant="muted">This shift may have been deleted.</AppText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <ShiftForm initialShift={shift} submitLabel="Update shift" onSubmit={handleSubmit} onDelete={handleDelete} />
      </Card>
    </Screen>
  );
}
