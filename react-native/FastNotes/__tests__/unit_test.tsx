import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

const mockBack = jest.fn();
const mockGetUser = jest.fn();
const mockInsert = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock("@react-navigation/native", () => ({
  useTheme: () => ({
    colors: {
      background: "#ffffff",
      text: "#111111",
      card: "#f5f5f5",
      primary: "#007AFF",
    },
  }),
}));

jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: ({ children }: any) => children,
}));

jest.mock("../components/ImagePickerSection", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockImagePickerSection() {
    return <View />;
  };
});

jest.mock("expo-image-picker", () => ({
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock("expo-file-system/legacy", () => ({
  getInfoAsync: jest.fn(),
}));

jest.mock("../lib/permissions", () => ({
  requestCameraPermission: jest.fn(),
  requestMediaLibraryPermission: jest.fn(),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: () => ({
      insert: mockInsert,
    }),
    storage: {
      from: () => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      }),
    },
  },
}));

describe("NewNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a valid note and navigates back", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
        },
      },
    });

    mockInsert.mockResolvedValue({ error: null });

    const NewNote = require("../app/(app)/new-note").default;

    render(<NewNote />);

    fireEvent.changeText(screen.getByPlaceholderText("Title"), "Test title");
    fireEvent.changeText(screen.getByPlaceholderText("Content"), "Test content");
    fireEvent.press(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });

    expect(mockBack).toHaveBeenCalled();
  });
});