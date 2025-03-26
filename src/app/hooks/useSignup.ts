import { translateSupabaseError } from "@/constants/translate";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface SignupForm {
  email: string;
  name: string;
  password: string;
}

export function useSignup() {
  const [loading, setLoading] = useState(false);

  async function handleSignUp({ name, email, password }: SignupForm) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, roles: false } },
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Erro no cadastro",
          text2: error.message.includes("email already")
            ? "Este email já está em uso. Tente outro email."
            : translateSupabaseError(error.message),
        });
        return;
      }

      const user = data?.user;
      if (!user || !user.email) {
        Toast.show({
          type: "error",
          text1: "Erro no cadastro",
          text2: "Não foi possível obter o email do usuário.",
        });
        return;
      }

      const { error: insertError } = await supabase.from("users").upsert([
        {
          id: user.id,
          email: user.email,
          name,
        },
      ]);

      if (insertError) {
        Toast.show({
          type: "error",
          text1: "Erro ao salvar usuário",
          text2: "Não foi possível associar o email ao usuário.",
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Cadastro realizado",
        text2: "Agora você pode fazer login",
      });

      router.replace("/screens/(auth)/signin/page");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro inesperado",
        text2: "Houve um problema ao realizar o cadastro.",
      });
      console.error(err);
    }
  }
  return { handleSignUp, loading };
}
