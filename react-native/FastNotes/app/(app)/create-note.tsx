import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import ImagePickerSection from "../../components/ImagePickerSection";
import { requestCameraPermission, requestMediaLibraryPermission } from "../../lib/permissions";

export default function CreateNoteScreen() {
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
    Alert.alert("Permission Denied", "Media library permission is required to pick an image."); // <---- Added
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

function handleSavePlaceholder() {
    Alert.alert("Temporary Note", "Next step is validation + upload + database save.");
}

function handleRemoveImage() { 
  setImageUri(null); 
}

return ( 
    <ScrollView contentContainerStyle={{ padding: 16 }}> {}
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>Create note</Text> {}

      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>Title</Text> {}
      <TextInput 
        value={title}
        onChangeText={setTitle}
        placeholder="Write a title" 
        style={{ 
          borderWidth: 1, 
          borderColor: "#d1d5db", 
          borderRadius: 8, 
          padding: 12, 
          marginBottom: 14, 
        }} 
      /> 

      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>Text</Text> {}
      <TextInput 
        value={content}
        onChangeText={setContent} 
        placeholder="Write your note"  
        multiline 
        style={{ 
          borderWidth: 1,
          borderColor: "#d1d5db", 
          borderRadius: 8, 
          padding: 12, 
          minHeight: 120, 
          textAlignVertical: "top", 
          marginBottom: 14,
        }} 
      /> 

      <ImagePickerSection 
        imageUri={imageUri} 
        onTakePhoto={handleTakePhoto} 
        onPickImage={handlePickImage} 
        onRemoveImage={handleRemoveImage} 
      /> 

      <TouchableOpacity 
        onPress={handleSavePlaceholder} 
        style={{ 
          marginTop: 20, 
          backgroundColor: "#111827", 
          paddingVertical: 14, 
          borderRadius: 8, 
          alignItems: "center",
        }} 
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Save note</Text> {}
      </TouchableOpacity> {}
    </ScrollView> 
  ); 
}
