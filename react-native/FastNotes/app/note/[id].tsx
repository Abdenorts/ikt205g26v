import type { Theme } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getNoteById } from "../../src/NotesStore";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const note = id ? getNoteById(id) : undefined;
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const router = useRouter();


  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Note not found</Text>
        <Link href="/" style={styles.link}>S
          Back
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>

      <View style={styles.card}>
        <Text style={styles.content}>{note.content}</Text>
      </View>
          <Pressable onPress={() => router.back()}
            style={({ pressed }) => [styles.backFab, pressed && styles.backFabPressed]}>
            <Text style={styles.backFabText}>Back</Text>
          </Pressable>
    </View>


  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backFab: {
      position: "absolute",
      bottom: 24,
      right: 20,
      paddingHorizontal: 18,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    backFabPressed: {
      opacity: 0.8,
    },
    backFabText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: "600",
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
      gap: 12,
    },
    headerRow: {
      marginBottom: 12,
    },
    backLink: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 12,
    },
    card: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: "underline",
      marginTop: 16,
    },
    notFound: {
      color: theme.colors.text,
      fontSize: 16,
    },
  });
}
