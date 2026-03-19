import * as ImagePicker from "expo-image-picker";

export async function requestCameraPermission(): Promise<boolean> {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    if(!result.granted) {
        alert("Camera permission is required to take photos.");
    }
    return result.granted;
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!result.granted) {
        alert("Media library permission is required to access images.");
    }
    return result.granted;
}

