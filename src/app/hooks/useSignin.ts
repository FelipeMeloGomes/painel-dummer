import { translateSupabaseError } from "@/constants/translate";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface LoginForm {
  email: string;
  password: string;
}

function useSignin() {
  const [loading, setLoading] = useState(false);
  async function handleSignIn({ email, password }: LoginForm) {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Erro no login",
          text2: translateSupabaseError(error.message),
        });
        return;
      }

      router.replace("/screens/(panel)/profile/page");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: "Houve um erro ao processar a sua solicitação. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return { loading, handleSignIn };
}

export default useSignin;
