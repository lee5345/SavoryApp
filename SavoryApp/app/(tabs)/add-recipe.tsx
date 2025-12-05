import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function AddRecipeScreen() {
  const [url, setUrl] = useState("");

  async function submit() {
    if (!url.trim()) return;
    router.push(`/modal?url=${encodeURIComponent(url)}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Recipe</Text>

      <Text style={styles.label}>Paste a cooking video URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://instagram.com/..."
        placeholderTextColor="#c3c3c3ff"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Analyze</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: "#ffffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.6,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#d18732ff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});