import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { useColorScheme as useRNColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export function useColorScheme() {
  return useRNColorScheme();
}

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerTitle: "Your Notes" }}/>
          <Stack.Screen name="new-note" options={{ headerTitle: "Create new note" }}/>
          <Stack.Screen name="note/[id]" options={{ headerTitle: "Note Detail" }}/>
        </Stack>
      </ThemeProvider>

    </KeyboardProvider>
  );
}