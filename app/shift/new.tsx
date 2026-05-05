import { router } from "expo-router";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { ShiftForm } from "@/components/ShiftForm";
import { createShift } from "@/lib/db";
import { ShiftInput } from "@/lib/types";

export default function NewShiftScreen() {
  async function handleSubmit(input: ShiftInput) {
    await createShift(input);
    router.back();
  }

  return (
    <Screen>
      <Card>
        <ShiftForm submitLabel="Save shift" onSubmit={handleSubmit} />
      </Card>
    </Screen>
  );
}
