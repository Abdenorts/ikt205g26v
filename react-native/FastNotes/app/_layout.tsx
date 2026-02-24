import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { supabase } from "../lib/supabase";

export function useColorScheme() {
  return useRNColorScheme();
}

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  if (isLoggedIn == null) return null;

  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Protected guard={isLoggedIn === true}>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack.Protected>

          <Stack.Protected guard={isLoggedIn === false}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} /> 
          </Stack.Protected>

        </Stack>
      </ThemeProvider>
    </KeyboardProvider>
  );
}