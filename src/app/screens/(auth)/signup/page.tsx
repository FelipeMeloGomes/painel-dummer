import colors from "@/constants/colors";
import { useSignup } from "@/src/app/hooks/useSignup";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { signUpSchema } from "../../../../schemas/validationSchema";
import styles from "./styles";

type SignUpForm = z.infer<typeof signUpSchema>;

export default function Signup() {
  const { handleSignUp, loading } = useSignup();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

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
