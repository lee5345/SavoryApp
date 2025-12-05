import { View, Text, Image, StyleSheet, useColorScheme, Pressable, Linking } from "react-native";
import { Colors } from "@/constants/theme";

export default function RecipeCard({ recipe }: { recipe: any }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const shortUrl = recipe.url
    ? recipe.url.replace(/^https?:\/\//, "").slice(0, 40) + "..."
    : null;

  function openUrl() {
    if (recipe.url) {
      Linking.openURL(recipe.url);
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      )}

      <Text style={[styles.title, { color: theme.text }]}>
        {recipe.title || "Untitled Recipe"}
      </Text>

      <Text style={[styles.subtitle, { color: theme.icon }]}>
        {recipe.ingredients?.length || 0} ingredients
      </Text>

      {recipe.url && (
        <Pressable onPress={openUrl}>
          <Text style={[styles.url, { color: theme.tint }]}>
            {shortUrl}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  url: {
    fontSize: 12,
    opacity: 0.8,
    textDecorationLine: "underline",
  },
});
