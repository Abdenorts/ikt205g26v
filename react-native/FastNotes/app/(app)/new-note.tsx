import { supabase } from "@/lib/supabase";
import type { Theme } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
  const [isSaving, setIsSaving] = useState(false);

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

async function validateImageBeforeUpload(): Promise<void> {
  if (!imageUri) {
    return;
  }

  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
  const fileExtension = imageUri.split(".").pop()?.toLowerCase();

  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    throw new Error("Invalid image format. Only JPG, PNG, and WEBP are allowed.");
  }

  const fileInfo = await FileSystem.getInfoAsync(imageUri);

  if (!fileInfo.exists) {
    throw new Error("Selected image file does not exist.");
  }

  if (!("size" in fileInfo) || typeof fileInfo.size !== "number") {
    throw new Error("Unable to determine image file size.");
  }

  const maxSizeInBytes = 15 * 1024 * 1024;

  if (fileInfo.size > maxSizeInBytes) {
    throw new Error("Image size exceeds the 15MB limit.");
  }
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

    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsSaving(false);
      Alert.alert("Error", "User not authenticated");
      return;
    }

    let imageUrl: string | null = null;

    try {
    await validateImageBeforeUpload();
    imageUrl = await uploadImageToSupabase();
    } catch (error) {
    setIsSaving(false);

    if (error instanceof Error) {
        Alert.alert("Image Error", error.message);
    } else {
        Alert.alert("Image Error", "Failed to validate or upload image.");
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
      setIsSaving(false);
      Alert.alert("Error", error.message);
      return;
    }

    setIsSaving(false);

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

        <Pressable onPress={onSave} style={styles.button} disabled={isSaving}>
            <View style={styles.buttonContent}>
                {isSaving ? <ActivityIndicator size="small" color={theme.colors.background}/>: null}
          <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Save"}</Text>
            </View>
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
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
        gap: 8,
    },
    buttonText: {
      color: theme.colors.background,
      fontWeight: "600",
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