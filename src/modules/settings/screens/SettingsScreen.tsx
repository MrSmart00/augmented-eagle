import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguagePicker } from "../components/LanguagePicker";

export function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LanguagePicker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
