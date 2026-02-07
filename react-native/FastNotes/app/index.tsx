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
      renderItem={({ item }) => (
        <Link href={`/note/${item.id}`} style={styles.button}>
          {item.title}
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
