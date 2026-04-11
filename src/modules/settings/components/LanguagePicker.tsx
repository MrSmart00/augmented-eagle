import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/src/shared";
import type { SupportedLanguage } from "@/src/shared";

interface LanguageOption {
  code: SupportedLanguage;
  labelKey: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "ja", labelKey: "settings.japanese" },
  { code: "en", labelKey: "settings.english" },
];

export function LanguagePicker() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("settings.language")}</Text>
      {LANGUAGES.map((option) => (
        <Pressable
          key={option.code}
          testID={`language-option-${option.code}`}
          style={[
            styles.option,
            language === option.code && styles.selectedOption,
          ]}
          onPress={() => changeLanguage(option.code)}
        >
          <Text
            style={[
              styles.optionText,
              language === option.code && styles.selectedText,
            ]}
          >
            {t(option.labelKey)}
          </Text>
          {language === option.code && (
            <Text testID={`checkmark-${option.code}`} style={styles.checkmark}>
              ✓
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  checkmark: {
    fontSize: 18,
    color: "#007AFF",
  },
});
