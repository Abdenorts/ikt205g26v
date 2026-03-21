import { supabase } from '@/lib/supabase';
import type { Theme } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type WorkNote = {
    id: number;
    title: string;
    content: string;
    image_url?: string;
};

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = Number(id);
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

useEffect(() => {
    (async () => {
      if(!id || Number.isNaN(noteId)) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('FastNotes')
        .select('id, title, content, image_url')
        .eq('id', noteId)
        .single();

      if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
      }

      const n = data as WorkNote;
      setTitle(n.title);
      setContent(n.content);
      setLoading(false);
      setImageUri(n.image_url || null);
    })();
  }, [id, noteId]);

  async function onSave() {
    const t = title.trim();
    const c = content.trim();

    if(!t || !c) {
        alert("Title and content cannot be empty");
        return;
    }

    const { data ,error } = await supabase
        .from('FastNotes')
        .update({ title: t, content: c, updated_at: new Date() })
        .eq('id', noteId)
        .select('id');

      if(error){
        Alert.alert("Error", "Note can only be updated by the creator.");
        return;
  } 
      if(!data || data.length === 0) {
      Alert.alert("Not updated!", "This note can only be updated by the creator.");
      return;
    }

    Alert.alert("Success", "Note updated");
    router.back();
  }

  async function onDelete() {
    Alert.alert(
      "Delete Note?", 
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", 
          style: "destructive",
           onPress: async () => {
            const { data, error } = await supabase
              .from('FastNotes')
              .delete()
              .eq('id', noteId)
              .select('id');

            if(error){
              Alert.alert("Not deleted", "This note can only be deleted by the creator.");
              return;
            }

            if(!data || data.length === 0) {
              Alert.alert("Not deleted", "This note can only be deleted by the creator.");
              return;
            }

            Alert.alert("Success", "Note deleted");
            router.back();
          } 
        },
      ]
    );
  }
      

  if (loading) return null;

  if (notFound) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Note not found</Text>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backFab, pressed && styles.backFabPressed]}>
          <Text style={styles.backFabText}>Back</Text>
        </Pressable>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <TextInput
       style={styles.title}
       value={title}
       onChangeText={setTitle}
       placeholder="Enter title"
      />

      <TextInput
       style={[styles.input, styles.contentInput]}
       value={content}
       onChangeText={setContent}
       placeholder="Enter content"
       multiline
       textAlignVertical='top'
      />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.noteImage} />
      ) : null}

      <Pressable onPress={onSave} style={styles.button}>
        <Text>Save</Text>
      </Pressable>

      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}
        style={({ pressed }) => [styles.backFab, pressed && styles.backFabPressed]}
        >
        <Text style={styles.backFabText}>Back</Text>
      </Pressable>
    </View>
  );
}


function createStyles(theme: Theme) {
  return StyleSheet.create({
    deleteButton: {
      padding: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    deleteText: {
      color: theme.colors.primary,
    },
    noteImage: {
      width: "100%",
      height: 220,
      borderRadius: 12,
      resizeMode: "cover",
    },
    input:{
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
    },
    contentInput: {
      minHeight: 200,
    },
    button:{
      backgroundColor: theme.colors.primary,
      padding: 10,
      alignItems: "center",
    },
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
