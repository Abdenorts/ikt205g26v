import type { Theme } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getNotes, Note } from "../src/NotesStore";



export default function Index() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  useFocusEffect(
    useCallback(() => { setNotes(getNotes()); }, [])
  );
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);


  return (
    <View style={styles.container}>
      <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={notes.length === 0 ? styles.emptyContainer : undefined}
      ListEmptyComponent={
      <Text style={styles.emptyText}>
        No notes yet. Click + button to create one!
        </Text>
        }
      renderItem={({ item }) => (
        <Link href={`/note/${item.id}`} asChild>
          <Pressable style={styles.noteCard}>
            <Text style={styles.noteTitle}>{item.title}</Text>
          </Pressable>
        </Link>
      )}
      />  

      <Pressable onPress={() => router.push("/new-note")}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    emptyContainer: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 26,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: 'center',
    },
    noteCard: {
      width: "100%",
      padding: 14,
      borderRadius: 12,
      backgroundColor: "white",
      marginBottom: 12,
    },
    noteTitle: {
      fontSize: 18,
      color: "#111",
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 32,
    },
    button: {
      fontSize: 20,
      textDecorationLine: "underline",
      color: theme.colors.primary,
    },
    fab: {
      position: "absolute",
      bottom: 32,
      right: 32,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    fabPressed: {
      opacity: 0.8,
    },
    fabText: {
      color: theme.colors.background,
      fontSize: 24,
    },
  });
}
