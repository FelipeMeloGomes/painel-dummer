import { translateSupabaseError } from "@/constants/translate";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface LoginForm {
  email: string;
  password: string;
}

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000;

function useSignin() {
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const handleSignIn = async ({ email, password }: LoginForm) => {
    if (lockoutTime && Date.now() < lockoutTime) {
      const timeLeft = Math.ceil((lockoutTime - Date.now()) / 1000);
      Toast.show({
        type: "error",
        text1: "Conta bloqueada",
        text2: `Tente novamente em ${timeLeft} segundos.`,
      });
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setLockoutTime(Date.now() + LOCK_TIME);
      Toast.show({
        type: "error",
        text1: "Muitas tentativas",
        text2: "Você atingiu o número máximo de tentativas.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: existingSession } = await supabase.auth.getSession();

      if (existingSession) {
        await supabase.auth.signOut();
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAttempts(attempts + 1);
        Toast.show({
          type: "error",
          text1: "Erro no login",
          text2: translateSupabaseError(error.message),
        });
        return;
      }

      setAttempts(0);
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
  };

  return { loading, handleSignIn };
}

export default useSignin;
