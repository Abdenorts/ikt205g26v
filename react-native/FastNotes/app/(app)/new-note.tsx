import { supabase } from "@/lib/supabase";
import type { Theme } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import ImagePickerSection from "../../components/ImagePickerSection";
import { requestCameraPermission, requestMediaLibraryPermission } from "../../lib/permissions";

export default function NewNote() {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  async function handleTakePhoto() {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera permission is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handlePickImage() {
    const hasPermission = await requestMediaLibraryPermission();

    if (!hasPermission) {
      Alert.alert("Permission Denied", "Media library permission is required to pick an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  function handleRemoveImage() {
    setImageUri(null);
  }

  async function uploadImageToSupabase(): Promise<string | null> {
    if (!imageUri) {
      return null;
    }

    const response = await fetch(imageUri);
    const arrayBuffer = await response.arrayBuffer();
    const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${Date.now()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from("FastNotes-pictures")
      .upload(filePath, arrayBuffer, {
        contentType: fileExtension === "jpg" ? "image/jpeg" : `image/${fileExtension}`,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("FastNotes-pictures")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function onSave() {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content cannot be empty");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    let imageUrl: string | null = null;

    try {
      imageUrl = await uploadImageToSupabase();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Image Upload Error", error.message);
      } else {
        Alert.alert("Image Upload Error", "Failed to upload image.");
      }
      return;
    }

    const { error } = await supabase.from("FastNotes").insert([
      {
        title: title.trim(),
        content: content.trim(),
        author: user.id,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Note saved successfully.");
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        bottomOffset={80}
      >
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
          textAlignVertical="top"
          scrollEnabled={false}
        />

        <ImagePickerSection
          imageUri={imageUri}
          onTakePhoto={handleTakePhoto}
          onPickImage={handlePickImage}
          onRemoveImage={handleRemoveImage}
        />

        <Pressable onPress={onSave} style={styles.button}>
          <Text>Save</Text>
        </Pressable>
      </KeyboardAwareScrollView>

      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backFab, pressed && styles.backFabPressed]}
      >
        <Text style={styles.backFabText}>Back</Text>
      </Pressable>
    </View>
  );
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
    text: {
      color: theme.colors.text,
    },
    input: {
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
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
      minHeight: 200,
    },
  });
}