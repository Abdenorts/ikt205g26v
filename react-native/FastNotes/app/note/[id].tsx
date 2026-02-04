import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { getNoteById } from "../../src/NotesStore";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const note = id ? getNoteById(id) : undefined;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 16,
    gap: 12,
  },
  notFound: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: 16,
  },
});
