"use client";

import { ReactNode, createContext, useContext } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import ToasterClient from "@/components/ToasterClient"; // ✅ import
import { toaster } from "@/components/ui/toaster";

const ToastContext = createContext({
  showToast: (options: Parameters<typeof toaster.create>[0]) => {},
});

function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = (options: Parameters<typeof toaster.create>[0]) => {
    toaster.create(options);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* ✅ Toaster client-only tetap di dalam ChakraProvider */}
      <ToasterClient />
    </ToastContext.Provider>
  );
}

export const useAppToast = () => useContext(ToastContext).showToast;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <ToastProvider>{children}</ToastProvider>
      </ChakraProvider>
    </Provider>
  );
}
