import colors from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Divider, Switch, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import DownloadButton from "../../components/Download/page";

export default function Profile() {
  const { setAuth, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [newRole, setNewRole] = useState<"premium" | "free" | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);

  type RoleName = "adm" | "premium" | "free";

  const roles: Record<
    RoleName,
    { isAdmin: boolean; isPremium: boolean; isFree: boolean }
  > = {
    adm: { isAdmin: true, isPremium: false, isFree: false },
    premium: { isAdmin: false, isPremium: true, isFree: false },
    free: { isAdmin: false, isPremium: false, isFree: true },
  };

  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (user && user.id) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("role_id")
            .eq("id", user.id)
            .limit(1);

          if (error) {
            Toast.show({
              type: "error",
              position: "bottom",
              text1: "Erro",
              text2: "Ocorreu um erro ao verificar o status do usuário.",
            });
            return;
          }

          if (data && Array.isArray(data) && data.length > 0) {
            const roleId = data[0]?.role_id;

            const { data: roleData, error: roleError } = await supabase
              .from("roles")
              .select("name")
              .eq("id", roleId)
              .single();

            if (roleError) {
              Toast.show({
                type: "error",
                position: "bottom",
                text1: "Erro",
                text2: "Ocorreu um erro ao buscar o papel do usuário.",
              });
              return;
            }

            if (roleData) {
              const role = roleData.name.trim().toLowerCase();
              const userRole = roles[role as RoleName] || {
                isAdmin: false,
                isPremium: false,
                isFree: false,
              };

              setIsAdmin(userRole.isAdmin);
              setIsPremium(userRole.isPremium);
              setIsFree(userRole.isFree);
              setRoleId(roleId);
            } else {
              setIsAdmin(false);
              setIsPremium(false);
              setIsFree(false);
              setRoleId(null);
            }
          } else {
            setIsAdmin(false);
            setIsPremium(false);
            setIsFree(false);
            setRoleId(null);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Erro",
            text2: "Houve um problema ao buscar as informações do usuário.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Erro",
          text2: "Você não está logado.",
        });
        setIsAdmin(false);
        setIsPremium(false);
        setIsFree(false);
      }
    };

    checkUserInDatabase();
  }, [user]);

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
        .eq("name", userEmail)
        .limit(1)
        .single();

      if (error || !data) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const userId = data.id;
      setRoleId(data.role_id);

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
                label="Nome do Usuário"
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="Nome do Usuário"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  buttons: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
    color: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 10,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
  },
  adminOptions: {
    marginTop: 20,
    width: "100%",
  },
  input: {
    marginBottom: 10,
  },
  roleButton: {
    marginBottom: 10,
  },
  changeRoleButton: {
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginTop: 30,
  },
});
