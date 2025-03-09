import colors from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Button, Divider, Switch, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import DownloadButton from "../../components/Download/page";
import { useUserRole } from "../../hooks/useUserRole";
import styles from "./styles";

export default function Profile() {
  const { setAuth, user } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [newRole, setNewRole] = useState<"premium" | "free" | null>(null);
  const { isAdmin, isPremium, isFree, roleId } = useUserRole();

  const changeUserRole = async () => {
    if (!userEmail || !newRole) {
      Alert.alert(
        "Erro",
        "Por favor, forneça o nome do usuário e o novo papel.",
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, role_id")
        .eq("email", userEmail)
        .limit(1)
        .single();

      if (error || !data) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const userId = data.id;
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", newRole)
        .single();

      if (roleError || !roleData) {
        Alert.alert("Erro", "Erro ao buscar a role.");
        return;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ role_id: roleData.id })
        .eq("id", userId);

      if (updateError) {
        Alert.alert("Erro", "Erro ao alterar o papel do usuário.");
        return;
      }

      Toast.show({
        position: "bottom",
        text1: "Sucesso",
        text2: "O papel do usuário foi alterado com sucesso!",
      });

      Alert.alert("Sucesso", `O papel do usuário foi alterado com sucesso!`);
    } catch (error) {
      Alert.alert("Erro", "Houve um problema ao alterar o papel do usuário.");
    }
  };

  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    setAuth(null);

    if (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: '"Erro", "Erro ao sair da conta, tente mais tarde."',
      });
      return;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Dumer <Text style={{ color: colors.green }}>Sensi</Text>
        </Text>

        <Text style={styles.slogan}>
          Painel
          <Text style={[{ color: colors.green }]}>
            {isAdmin ? "Moderador" : isPremium ? "Premium" : "Free"}
          </Text>
        </Text>
      </View>

      <View style={styles.buttons}>
        {isAdmin && (
          <>
            <Text variant="displaySmall">Setar Planos</Text>
            <View style={styles.adminOptions}>
              <TextInput
                label="Email do Usuário"
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="Email do Usuário"
                style={styles.input}
              />
              {roleId && (
                <Text variant="bodyLarge">
                  Status do Usuário: Role ID - {roleId}
                </Text>
              )}
              <Divider />
              <View style={styles.switchContainer}>
                <Text variant="bodyLarge">Free</Text>
                <Switch
                  value={newRole === "premium"}
                  onValueChange={(value) => {
                    const role = value ? "premium" : "free";
                    setNewRole(role);
                    changeUserRole();
                  }}
                />
                <Text variant="bodyLarge">Premium</Text>
              </View>
            </View>
          </>
        )}

        <DownloadButton />
        <Button icon="logout" mode="contained-tonal" onPress={handleSignout}>
          Sair
        </Button>
      </View>
    </View>
  );
}
