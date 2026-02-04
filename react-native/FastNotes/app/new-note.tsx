import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { addNote } from "../src/NotesStore";

export default function NewNote() {
    const router = useRouter();

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    
    function onSave() {
        addNote(title, content);
        router.back();
    }

    return(
        <KeyboardAvoidingView style= {styles.container} behavior="height">
            <View style={styles.inner}>
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
                    style={styles.input}
                    placeholder="Content"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <Pressable onPress={onSave} style={styles.button}>
                    <Text>Save</Text>
                </Pressable>

                <Link href="/" style={styles.link}>
                Back
                </Link>
            </View>
        </KeyboardAvoidingView>
    )

}
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#25292e"
        },
        inner: {
            padding: 16,
            gap: 12,
        },
        text:{
            color: "#fff"
        },
        input: {
            backgroundColor: "#fff",
            padding: 10,
            color: "#000"
        },
        button: {
            backgroundColor: "#fff",
            padding: 10,
            alignItems: "center",
        },
        link: {
            color: "#fff",
            textDecorationLine: "underline",
        },

    });
