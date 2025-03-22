import colors from "@/constants/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { supabase } from "../../../../lib/supabase";
import styles from "./styles";

const emailSchema = z.object({
  email: z.string().min(5, "O email é obrigatório").email("Email inválido"),
});

type EmailForm = z.infer<typeof emailSchema>;

function translateSupabaseError(message: string): string {
  const errorMap: Record<string, string> = {
    "Invalid email address": "Endereço de email inválido.",
    "User not found": "Usuário não encontrado.",
  };

  return errorMap[message] || "Ocorreu um erro inesperado. Tente novamente.";
}

export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Dumer <Text style={{ color: colors.green }}>Sensi</Text>
        </Text>
        <Text style={styles.slogan}>Recuperar Senha</Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                outlineColor="black"
                activeOutlineColor="black"
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                left={<TextInput.Icon icon="email" />}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        <Pressable
          style={styles.button}
          onPress={handleSubmit(handleResetPassword)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? <ActivityIndicator animating={true} /> : "Enviar Link"}
          </Text>
        </Pressable>
      </View>
      <Toast />
    </View>
  );
}


