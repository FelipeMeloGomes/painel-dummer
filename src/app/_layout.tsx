import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
function MainLayout() {
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        router.replace("/screens/(panel)/profile/page");
        return;
      }
      setAuth(null);
      router.replace("/screens/(auth)/signin/page");
    });
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(auth)/signup/page" />
      <Stack.Screen name="screens/(auth)/signin/page" />
      <Stack.Screen name="screens/(auth)/resetPassword/page" />
      <Stack.Screen name="screens/(panel)/profile/page" />
    </Stack>
  );
}
