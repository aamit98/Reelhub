import "../global.css";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import GlobalProvider from "../context/GlobalProvider";
import { ErrorBoundary } from "../components";
import { queryClient } from "../lib/queryClient";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </GlobalProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
