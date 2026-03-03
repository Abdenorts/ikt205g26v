import { supabase } from '@/lib/supabase';
import type { Theme } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";


export default function NewNote() {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const router = useRouter();

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    
async function onSave() {
    const t = title.trim(); 
    const c = content.trim(); 
    if(!t || !c) {
        alert("Title and content cannot be empty");
        return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("User not authenticated");
        return;
    }

    const { error } = await supabase
        .from('FastNotes')
        .insert([{ 
            title: t,
            content: c,
            author: user.id,
            updated_at: new Date().toISOString(),
            }]);


    if (error) {
        Alert.alert("Error!", " Error Failed to save note.");
        return;
    } 
    Alert.alert("Success!", "Note saved successfully.");
    router.back();
}

    return(
    <View style={[{ flex: 1, backgroundColor: theme.colors.background }]}>
        <KeyboardAwareScrollView
        contentContainerStyle={ styles.inner }
        keyboardShouldPersistTaps='handled'
        bottomOffset={80}>

            <Text style={styles.text}>New note</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical='top'
                scrollEnabled={false}
            />

            <Pressable onPress={onSave} style={styles.button}>
                <Text>Save</Text>
            </Pressable>
            
        </KeyboardAwareScrollView>

            <Pressable onPress={() => router.back()} 
                style={({ pressed }) => [styles.backFab, pressed && styles.backFabPressed]}>
                <Text style={styles.backFabText}>Back</Text>
            </Pressable>
    </View>
    )

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
    inner: {
        padding: 16,
        gap: 12,
    },
    text:{
        color: theme.colors.text
    },
    input: {
        backgroundColor: theme.colors.card,
        padding: 10,
        color: theme.colors.text
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        alignItems: "center",
    },
    link: {
        color: theme.colors.text,
        textDecorationLine: "underline",
    },
    contentInput: {
        minHeight:200,
    },

    });
}