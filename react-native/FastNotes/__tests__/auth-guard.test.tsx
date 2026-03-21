import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

jest.mock("react-native-keyboard-controller", () => ({
  KeyboardProvider: ({ children }: any) => children,
}));

jest.mock("@react-navigation/native", () => ({
  DarkTheme: {},
  DefaultTheme: {},
  ThemeProvider: ({ children }: any) => children,
}));

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");

  const Stack = ({ children }: any) => <>{children}</>;

  Stack.Screen = ({ name }: any) => <Text>{name}</Text>;
  Stack.Protected = ({ guard, children }: any) => (guard ? <>{children}</> : null);

  return {
    Stack,
    ErrorBoundary: () => null,
  };
});

describe("RootLayout auth guard", () => {
  it("shows login and signup when user is not logged in", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });

    const RootLayout = require("../app/_layout").default;

    render(<RootLayout />);

    await waitFor(() => {
      expect(screen.getByText("login")).toBeTruthy();
    });

    expect(screen.getByText("signup")).toBeTruthy();
    expect(screen.queryByText("(app)")).toBeNull();
  });
});