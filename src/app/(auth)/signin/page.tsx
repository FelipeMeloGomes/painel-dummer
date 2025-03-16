import colors from "@/constants/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { supabase } from "../../../lib/supabase";

const loginSchema = z.object({
  email: z.string().min(5, "O email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

function translateSupabaseError(message: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials":
      "Credenciais inválidas. Verifique seu email e senha.",
    "User not found": "Usuário não encontrado.",
    "Email not confirmed":
      "Seu email ainda não foi confirmado. Verifique sua caixa de entrada.",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres.",
  };

  return errorMap[message] || "Ocorreu um erro inesperado. Tente novamente.";
}

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSignIn({ email, password }: LoginForm) {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: translateSupabaseError(error.message),
      });
      return;
    }

    router.replace("/(panel)/profile/page");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Dumer <Text style={{ color: colors.green }}>Sensi</Text>
        </Text>
        <Text style={styles.slogan}>A melhor sensi para free fire</Text>
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

        <View>
          <Text style={styles.label}>Senha</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                outlineColor="black"
                activeOutlineColor="black"
                placeholder="Digite sua senha"
                secureTextEntry={passwordVisible}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        <Pressable
          style={styles.button}
          onPress={handleSubmit(handleSignIn)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? <ActivityIndicator animating={true} /> : "Acessar"}
          </Text>
        </Pressable>
        <Link href="/(auth)/signup/page" style={styles.link}>
          <Text>Ainda não possui uma conta? Cadastre-se</Text>
        </Link>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: colors.zinc,
  },
  header: {
    paddingLeft: 14,
    paddingRight: 14,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 34,
    color: colors.white,
    marginBottom: 34,
  },
  form: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
  },
  label: {
    color: colors.zinc,
    marginBottom: 4,
  },
  link: {
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.green,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});
