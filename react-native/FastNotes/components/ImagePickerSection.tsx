import { Image, Text, TouchableOpacity, View } from "react-native";

type ImagePickerSectionProps = {
  imageUri: string | null;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
};

export default function ImagePickerSection({
  imageUri,
  onTakePhoto,
  onPickImage,
  onRemoveImage,
}: ImagePickerSectionProps) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Image
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={onTakePhoto}
          style={{
            backgroundColor: "#007AFF",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPickImage}
          style={{
            backgroundColor: "#007AFF",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Choose Image</Text>
        </TouchableOpacity>
      </View>

      {imageUri ? (
        <View>
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 220,
              height: 220,
              borderRadius: 8,
              resizeMode: "cover",
              marginBottom: 10,
            }}
          />

          <TouchableOpacity
            onPress={onRemoveImage}
            style={{
              backgroundColor: "#FF3B30",
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Remove Image
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={{ color: "#888", fontStyle: "italic" }}>
          No image selected
        </Text>
      )}
    </View>
  );
}
