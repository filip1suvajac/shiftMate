import { KeyboardTypeOptions, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  error?: string;
};

export function Input({ label, value, onChangeText, placeholder, keyboardType, multiline, error }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.wrap}>
      <AppText variant="label" style={{ color: colors.muted }}>
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.multiline,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            color: colors.text
          }
        ]}
      />
      {error ? <AppText style={{ color: colors.danger, fontSize: 13 }}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 7
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 16
  },
  multiline: {
    minHeight: 88,
    paddingTop: 12,
    textAlignVertical: "top"
  }
});
