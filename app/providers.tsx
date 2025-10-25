"use client";

import { ReactNode, createContext, useContext } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { Toaster, toaster } from "@/components/ui/toaster"; // Pastikan path ini sesuai dengan struktur proyek Anda

// Context untuk Toast
const ToastContext = createContext({
  showToast: (options: Parameters<typeof toaster.create>[0]) => {},
});

// ToastProvider untuk menyediakan fungsi showToast
function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = (options: Parameters<typeof toaster.create>[0]) => {
    toaster.create(options);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Hook untuk menggunakan toast
export const useAppToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within ToastProvider");
  }
  return context.showToast;
};

// Main Provider
export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <ToastProvider>
          <Toaster />
          {children}
        </ToastProvider>
      </ChakraProvider>
    </Provider>
  );
}
