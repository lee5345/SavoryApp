import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecipeCard from "@/components/recipe-card";
import { router } from "expo-router";

type Recipe = {
  title: string;
  video_url: string;
  ingredients: string[];
  steps: string[];
  tools: string[];
  time_estimate?: string;
  extra_notes?: string;
};

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Load recipes on mount
  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem("recipes");
      if (stored) setRecipes(JSON.parse(stored));
    }
    load();
  }, []);

  // Delete a recipe
  async function deleteRecipe(index: number) {
    const updated = recipes.filter((_, i) => i !== index);
    setRecipes(updated);
    await AsyncStorage.setItem("recipes", JSON.stringify(updated));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.subtitle}>No recipes found!</Text>
          <Text style={styles.paragraph}>
            Add your first recipe by pasting a URL in the “Add Recipe” tab.
          </Text>
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <Text style={styles.title}>My Library</Text>
          {recipes.map((recipe, i) => (
            <Pressable
              key={i}
              onPress={() => router.push(`/recipe/${i}`)} // open detail modal/screen
              onLongPress={() =>
                Alert.alert(
                  "Delete Recipe",
                  `Delete "${recipe.title}"?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteRecipe(i) },
                  ]
                )
              }
            >
              <RecipeCard recipe={recipe} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    opacity: 0.8,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 12,
  },

  paragraph: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    maxWidth: 260,
  },
});
