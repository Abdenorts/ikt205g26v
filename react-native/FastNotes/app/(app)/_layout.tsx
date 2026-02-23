import { Stack } from "expo-router";

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Your Notes" }}/>
            <Stack.Screen name="new-note" options={{ headerTitle: "Create new note" }}/>
            <Stack.Screen name="note/[id]" options={{ headerTitle: "Note Detail" }}/>
        </Stack>
    );
}