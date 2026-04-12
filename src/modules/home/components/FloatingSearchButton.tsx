import { useRef } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import Animated from "react-native-reanimated";
import { useFloatingSearch } from "../hooks/useFloatingSearch";

interface FloatingSearchButtonProps {
  searchText: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardHeight?: number;
}

export function FloatingSearchButton({
  searchText,
  onChangeText,
  placeholder,
  keyboardHeight = 0,
}: FloatingSearchButtonProps) {
  const {
    isExpanded,
    toggle,
    close,
    fabAnimatedStyle,
    iconAnimatedStyle,
    inputAnimatedStyle,
  } = useFloatingSearch();
  const inputRef = useRef<TextInput>(null);

  const handleOpen = () => {
    toggle();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onChangeText("");
    close();
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          fabAnimatedStyle,
          keyboardHeight > 0 && {
            bottom: keyboardHeight + (Platform.OS === "ios" ? 8 : 32),
          },
        ]}
      >
        {isExpanded ? (
          <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
            <TextInput
              ref={inputRef}
              testID="search-input"
              style={styles.input}
              placeholder={placeholder}
              value={searchText}
              onChangeText={onChangeText}
            />
            <Pressable
              testID="search-close-button"
              onPress={handleClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable testID="floating-search-fab" onPress={handleOpen}>
            <Animated.View style={iconAnimatedStyle}>
              <Text style={styles.fabIcon}>🔍</Text>
            </Animated.View>
          </Pressable>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: "#666",
  },
  fabIcon: {
    fontSize: 24,
  },
});
