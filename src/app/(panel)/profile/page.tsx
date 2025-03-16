import colors from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Card, Chip, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import DownloadButton from "../../components/Download/page";
import UserCount from "../../components/UserCount/page";
import { useUserRole } from "../../hooks/useUserRole";
import styles from "./styles";

export default function Profile() {
  const { setAuth, user } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [newRole, setNewRole] = useState<"premium" | "free" | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [triggerChange, setTriggerChange] = useState(false);
  const { isAdmin, isPremium, isFree, roleId } = useUserRole();

  useEffect(() => {
    if (user?.id) {
      fetchUserName(user.id);
    }
  }, [user]);

  const fetchUserName = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", userId)
        .single();

      if (error || !data) {
        Alert.alert("Erro", "Não foi possível buscar o nome do usuário.");
        return;
      }

      setUserName(data.name);
    } catch (error) {
      Alert.alert("Erro", "Houve um problema ao buscar o nome.");
    }
  };

  useEffect(() => {
    if (triggerChange && newRole) {
      changeUserRole();
      setTriggerChange(false);
    }
  }, [newRole, triggerChange]);

  const handleRoleChange = (role: "premium" | "free") => {
    setNewRole(role);
    setTriggerChange(true);
  };

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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.informations}>
            <Text style={styles.logoText}>
              Dumer <Text style={{ color: colors.green }}>Sensi</Text>
            </Text>
            <View>
              <Chip mode="outlined" selected={isAdmin || isPremium}>
                {isAdmin ? "Moderador" : isPremium ? "Premium" : "Free"}
              </Chip>
            </View>
          </View>

          <Card style={styles.buttons}>
            {isAdmin && (
              <>
                <Card>
                  <Card.Title title="Setar Planos" subtitle="Alterar planos" />
                  <Card.Content>
                    <View>
                      <TextInput
                        mode="outlined"
                        outlineColor="black"
                        activeOutlineColor="black"
                        label="Email do Usuário"
                        value={userEmail}
                        onChangeText={setUserEmail}
                        placeholder="Email do Usuário"
                        style={styles.input}
                      />

                      <Card style={styles.switchContainer}>
                        <Card.Actions>
                          <Button
                            mode={newRole === "free" ? "contained" : "outlined"}
                            onPress={() => handleRoleChange("free")}
                            style={styles.roleButton}
                            icon="gift"
                          >
                            Free
                          </Button>

                          <Button
                            mode={
                              newRole === "premium" ? "contained" : "outlined"
                            }
                            onPress={() => handleRoleChange("premium")}
                            style={styles.roleButton}
                            icon="crown"
                          >
                            Premium
                          </Button>
                        </Card.Actions>
                      </Card>
                    </View>
                  </Card.Content>
                </Card>
                <Card style={styles.countContainer}>
                  <Card.Title title="Contagem de Usuários" />
                  <Card.Content>
                    <UserCount />
                  </Card.Content>
                </Card>
              </>
            )}
            <Card style={styles.containerBtn}>
              {isAdmin ? (
                <>
                  <DownloadButton userRole="premium" />
                  <DownloadButton userRole="free" />
                </>
              ) : (
                <DownloadButton userRole={isPremium ? "premium" : "free"} />
              )}
              <Button
                icon="logout"
                mode="contained-tonal"
                onPress={handleSignout}
              >
                Sair
              </Button>
            </Card>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
