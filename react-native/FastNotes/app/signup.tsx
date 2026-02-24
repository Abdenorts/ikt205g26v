// app/signup.tsx

import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (!email.trim() || !password.trim()) { 
      Alert.alert("Error", "Please enter both email and password.");
      return; 
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password }); 
    setLoading(false);

    if (error) {
      Alert.alert("Signup Error", error.message);
      return;
    }

    if (!data.session) {
      Alert.alert("Account created", "Now sign in with your email and password.");
      router.replace("/login");
      return;
    }

    Alert.alert("Success", "Account created.");
  }

  return ( 
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24 }}>Create account</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={signUpWithEmail}
        disabled={loading}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8, alignItems: "center" }}
      >
        <Text>{loading ? "..." : "Create account"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        style={{ padding: 12, alignItems: "center" }}
      >
        <Text>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
}