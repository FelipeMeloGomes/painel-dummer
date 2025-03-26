import { translateSupabaseError } from "@/constants/translate";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface EmailForm {
  email: string;
}

function useResetPassword() {
  const [loading, setLoading] = useState(false);

  async function handleResetPassword({ email }: EmailForm) {
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (error) {
      if (error.message.includes("no user found")) {
        Toast.show({
          type: "error",
          text1: "Email não encontrado",
          text2:
            "Não encontramos um usuário com esse email. Verifique e tente novamente.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao enviar o link",
          text2: translateSupabaseError(error.message),
        });
      }
      return;
    }

    Toast.show({
      type: "success",
      text1: "Email enviado",
      text2: "Confira sua caixa de entrada para redefinir a senha.",
    });

    router.replace("/screens/(auth)/signin/page");
  }

  return { loading, handleResetPassword };
}

export default useResetPassword;
