import type { Theme } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

// This is created in case I need it for a bigger implementation. 

type WorkNote = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
};

export default function WorkNotes() {
    const [workNotes, setWorkNotes] = useState<WorkNote[]>([]);
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const router = useRouter();

    useEffect(() => {
        async function fetchWorkNotes() {
            const { data, error } = await supabase
                .from('FastNotes')
                .select('id, title, content, created_at, updated_at')
                .order('created_at', { ascending: false });
                
            if (error) {
                console.error("Error fetching work notes:", error);
            } else {
                setWorkNotes((data ?? []) as WorkNote[]);
            }
        }

        fetchWorkNotes();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Work Notes</Text>
            
            <FlatList
                data={workNotes}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={workNotes.length === 0 ? styles.emptyContainer : undefined}
                ListEmptyComponent={<Text style={styles.emptyText}>No work notes found.</Text>}
                renderItem={({ item }) => (
                    <Link href={`/note/${item.id}`} asChild>
                        <Pressable style={styles.noteCard}>
                            <Text style={styles.noteTitle}>{item.title}</Text>
                            <Text style={styles.noteContent} numberOfLines={2}>{item.content}</Text>
                            <Text style={styles.noteMeta}>updated: {item.updated_at}</Text>
                        </Pressable>
                    </Link>
                )}
            /></View>
    );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 32,
      paddingHorizontal: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 12,
    },
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
      fontWeight: "700",
      color: "#111",
      marginBottom: 6,
    },
    noteContent: {
      color: "#111",
      marginBottom: 6,
    },
    noteMeta: {
      fontSize: 12,
      opacity: 0.7,
      color: "#111",
    },
  });
}
