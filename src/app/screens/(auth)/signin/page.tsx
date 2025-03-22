import colors from "@/constants/colors";
import { translateSupabaseError } from "@/constants/translate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { supabase } from "../../../../lib/supabase";
import styles from "./styles";
import { loginSchema } from "../../../../schemas/validationSchema";

type LoginForm = z.infer<typeof loginSchema>;

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

        <View style={styles.buttonContainer}>
          <Link href="/screens/(auth)/resetPassword/page" style={styles.link}>
            <Text>Esqueceu a senha?</Text>
          </Link>

          <Pressable
            style={styles.button}
            onPress={handleSubmit(handleSignIn)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator animating={true} /> : "Acessar"}
            </Text>
          </Pressable>
          <Link href="/screens/(auth)/signup/page" style={styles.link}>
            <Text>Ainda não possui uma conta? Cadastre-se</Text>
          </Link>
        </View>
      </View>
      <Toast />
    </View>
  );
}
