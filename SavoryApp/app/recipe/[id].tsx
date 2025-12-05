import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    loadRecipe();
  }, []);

  async function loadRecipe() {
    const data = await AsyncStorage.getItem("recipes");
    if (!data) return;

    const list = JSON.parse(data);
    const item = list[Number(id)];
    setRecipe(item);
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>

      <Text style={styles.section}>Ingredients</Text>
      {recipe.ingredients?.map((ing: string, i: number) => (
        <Text key={i} style={styles.item}>• {ing}</Text>
      ))}

      <Text style={styles.section}>Steps</Text>
      {recipe.steps?.map((s: string, i: number) => (
        <Text key={i} style={styles.item}>{i + 1}. {s}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 0,
  },
  section: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 20,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
});