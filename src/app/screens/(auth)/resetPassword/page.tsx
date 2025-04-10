import colors from "@/constants/colors";
import Header from "@/src/app/components/Header/page";
import useResetPassword from "@/src/app/hooks/useResetPassword";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { emailSchema } from "../../../../schemas/validationSchema";
import styles from "./styles";

type EmailForm = z.infer<typeof emailSchema>;

export default function ResetPassword() {
  const { loading, handleResetPassword } = useResetPassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <Header title="Dumer" highlight="Sensi" slogan="Recuperar Senha" />
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
