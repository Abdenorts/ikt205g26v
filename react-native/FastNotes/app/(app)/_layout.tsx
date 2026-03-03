import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { supabase } from "../../lib/supabase";

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen 
            name="index" 
            options={{ 
                headerTitle: "Jobb notater",
                headerRight: () => (
                    <Pressable 
                    onPress={async () => {
                        await supabase.auth.signOut();
                    }}
                    style={{ paddingHorizontal: 12 }}
                    >
                        <Text> Sign Out |</Text>
                    </Pressable>
                ),
                  }}
                />
            <Stack.Screen name="new-note" options={{ headerTitle: "Create new note" }}/>
            <Stack.Screen name="note/[id]" options={{ headerTitle: "Note Detail" }}/>
        </Stack>
    );
}