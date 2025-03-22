import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { supabase } from "../../../../lib/supabase";
import styles from "./styles";

const signUpSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

function translateSupabaseError(message: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials":
      "Credenciais inválidas. Verifique seu email e senha.",
    "User not found": "Usuário não encontrado.",
    "Email not confirmed":
      "Seu email ainda não foi confirmado. Verifique sua caixa de entrada.",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres.",
    "Email already taken": "Este email já está em uso.",
    "Weak password": "A senha é muito fraca. Use uma senha mais forte.",
    "Invalid email format": "Formato de email inválido.",
  };

  return errorMap[message] || "Ocorreu um erro inesperado. Tente novamente.";
}

export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignUp({ name, email, password }: SignUpForm) {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </Pressable>
            <Text style={styles.logoText}>
              Dumer <Text style={{ color: colors.green }}>Sensi</Text>
            </Text>
            <Text style={styles.slogan}>Cadastrar Usuário</Text>
          </View>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Nome completo</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    outlineColor="black"
                    activeOutlineColor="black"
                    placeholder="Nome completo"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    left={<TextInput.Icon icon="account" />}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

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
              onPress={handleSubmit(handleSignUp)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator animating={true} /> : "Cadastrar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}
