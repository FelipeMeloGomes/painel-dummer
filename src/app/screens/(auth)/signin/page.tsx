import Header from "@/src/app/components/Header/page";
import useSignin from "@/src/app/hooks/useSignin";
import useTogglePasswordVisibility from "@/src/app/hooks/useTogglePasswordVisibility";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { loginSchema } from "../../../../schemas/validationSchema";
import styles from "./styles";

type LoginForm = z.infer<typeof loginSchema>;

export default function Signin() {
  const { loading, handleSignIn } = useSignin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const { passwordVisible, togglePasswordVisibility } =
    useTogglePasswordVisibility();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title="Dumer"
          highlight="Sensi"
          slogan="A sensi perfeita para elevar seu jogo no Free Fire!"
        />
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
                    onPress={togglePasswordVisibility}
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
