import type { Theme } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { addNote } from "../src/NotesStore";

export default function NewNote() {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const router = useRouter();

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    
    function onSave() {addNote(title, content);router.back();}

    return(
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: theme.colors.background }}
    behavior='height'>

        <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.inner, { flexGrow: 1}]}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='none'
        >
            <Text style={styles.text}>
                New note
            </Text>



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

            <Link href="/" style={styles.link}>
            Back
            </Link>
            <View style={styles.keyboardSpacer}/>
        </ScrollView>
        </KeyboardAvoidingView>
    )

}
function createStyles(theme: Theme) {
  return StyleSheet.create({
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
        keyboardSpacer: {
            height: 360,
        },

    });
}