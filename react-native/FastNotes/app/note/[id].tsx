import type { Theme } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { getNoteById } from "../../src/NotesStore";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const note = id ? getNoteById(id) : undefined;
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);


  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Note not found</Text>
        <Link href="/" style={styles.link}>
          Back to Notes
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content}>{note.content}</Text>
      <Link href="/" style={styles.link}>
        Back to Notes
      </Link>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
      gap: 12,
    },
    notFound: {
      color: theme.colors.text,
      fontSize: 16,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
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
  });
}
