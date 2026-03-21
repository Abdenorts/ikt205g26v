import { act, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({
  single: mockSingle,
}));
const mockSelect = jest.fn(() => ({
  eq: mockEq,
}));
const mockFrom = jest.fn(() => ({
  select: mockSelect,
}));

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ id: "1" }),
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
      border: "#cccccc",
    },
  }),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: mockFrom,
  },
}));

describe("NoteDetail loader integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loader while fetching and hides it when note is loaded", async () => {
    let resolveRequest: (value: any) => void;

    const pendingPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    mockSingle.mockReturnValue(pendingPromise);

    const NoteDetail = require("../app/(app)/note/[id]").default;

    render(<NoteDetail />);

    expect(screen.getByText("Loading...")).toBeTruthy();

    await act(async () => {
      resolveRequest({
        data: {
          id: 1,
          title: "Loaded title",
          content: "Loaded content",
          image_url: null,
        },
        error: null,
      });

      await pendingPromise;
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Loaded title")).toBeTruthy();
    });

    expect(screen.queryByText("Loading...")).toBeNull();
    expect(screen.getByDisplayValue("Loaded content")).toBeTruthy();
  });
});