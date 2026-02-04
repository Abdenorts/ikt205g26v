import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Your Notes" }}/>
      <Stack.Screen name="new-note" options={{ headerTitle: "Note" }}/>
      <Stack.Screen name="note/[id]" options={{ headerTitle: "Note Detail" }}/>
    </Stack>
  );
}