import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalScreen() {
  const { url } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    async function fetchRecipe() {
      try {
        setLoading(true);
        const res = await fetch("http://100.69.253.96:3000/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unknown error");

        setRecipe(data.recipe);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [url]);

  async function saveRecipe() {
    try {
      const existing = JSON.parse(await AsyncStorage.getItem("recipes") || "[]");
    
      const recipeWithUrl = {
        ...recipe,
        url,
      };

      const updated = [...existing, recipeWithUrl];

      await AsyncStorage.setItem("recipes", JSON.stringify(updated));
      router.push(`/(tabs)/add-recipe`);
    } catch (err) {
      alert("Failed to save recipe.");
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d77c37ff" />
        <Text style={styles.loadingText}>Analyzing video...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recipe Extracted</Text>

      <Text style={styles.json}>{JSON.stringify(recipe, null, 2)}</Text>

      <Pressable style={styles.saveButton} onPress={saveRecipe}>
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },
  json: {
    fontFamily: "Courier",
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.6,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#d77c37ff",
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});