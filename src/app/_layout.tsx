import { router, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { View } from "react-native";

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
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/(auth)/signup/page"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="screens/(auth)/signin/page"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/(auth)/resetPassword/page"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/(panel)/profile/page"
          options={{ headerShown: false }}
        />
      </Stack>
    </View>
  );
}
