/* eslint-disable @typescript-eslint/no-explicit-any */

// ✅ Mock window.location agar bisa dites tanpa error navigation
delete (window as any).location;
(window as any).location = { href: "", assign: jest.fn() };

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import authReducer from "@/app/store/slices/auth";
import LoginPage from "./page";
import { useAppToast } from "@/app/providers";

// ✅ Mock router Next.js
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// ✅ Mock Chakra UI Spinner
jest.mock("@chakra-ui/react", () => {
  const original = jest.requireActual("@chakra-ui/react");
  return {
    ...original,
    Spinner: () => <div data-testid="spinner" />,
  };
});

// ✅ Mock PasswordInput agar bisa diisi text
jest.mock("@/components/ui/password-input", () => ({
  PasswordInput: (props: any) => <input {...props} />,
}));

// ✅ Mock PublicGuard agar tidak redirect
jest.mock("@/app/guards/public", () => ({
  PublicGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ✅ Mock custom hook toast
jest.mock("@/app/providers", () => ({
  useAppToast: jest.fn(),
}));

// ✅ Mock react-redux hooks
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("LoginPage (Next.js)", () => {
  const mockDispatch = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation(
      (selectorFn: any) =>
        selectorFn({
          auth: {
            user: null,
            loading: false,
            error: false,
            success: false,
            message: "",
          },
        })
    );
    (useAppToast as jest.Mock).mockReturnValue(mockShowToast);
  });

  // ✅ Tambahkan ChakraProvider di luar Provider Redux
  const renderWithProvider = () =>
    render(
      <ChakraProvider value={defaultSystem}>
        <Provider
          store={configureStore({
            reducer: { auth: authReducer },
          })}>
          <LoginPage />
        </Provider>
      </ChakraProvider>
    );

  test("renders login form correctly", () => {
    renderWithProvider();

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  test("dispatches login thunk when form is valid", async () => {
    renderWithProvider();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test("shows error toast when login fails", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation(
      (selectorFn: any) =>
        selectorFn({
          auth: {
            user: null,
            loading: false,
            error: true,
            success: false,
            message: "Invalid credentials",
          },
        })
    );

    renderWithProvider();

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error occured",
          description: "Invalid credentials",
          type: "error",
        })
      );
    });
  });

  test("shows success toast when login succeeds", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation(
      (selectorFn: any) =>
        selectorFn({
          auth: {
            user: { id: 1, name: "John Doe" },
            loading: false,
            error: false,
            success: true,
            message: "Login successful",
          },
        })
    );

    renderWithProvider();

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Sucess",
          description: "Login successful",
          type: "success",
        })
      );
    });
  });
});
