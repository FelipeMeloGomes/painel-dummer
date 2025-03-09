import colors from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import DownloadButton from "../../components/Download/page";

export default function Profile() {
  const { setAuth, user } = useAuth();
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isFree, setIsFree] = useState(false);

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
            Alert.alert(
              "Erro",
              "Ocorreu um erro ao verificar o status do usuário.",
            );
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
              Alert.alert(
                "Erro",
                "Ocorreu um erro ao buscar o papel do usuário.",
              );
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
            } else {
              setIsAdmin(false);
              setIsPremium(false);
              setIsFree(false);
            }
          } else {
            setIsAdmin(false);
            setIsPremium(false);
            setIsFree(false);
          }
        } catch (error) {
          Alert.alert(
            "Erro",
            "Houve um problema ao buscar as informações do usuário.",
          );
        }
      } else {
        Alert.alert("Erro", "Você não está logado.");
        setIsAdmin(false);
        setIsPremium(false);
        setIsFree(false);
      }
    };

    checkUserInDatabase();
  }, [user]);

  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    setAuth(null);

    if (error) {
      Alert.alert("Erro", "Erro ao sair da conta, tente mais tarde.");
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
  link: {
    backgroundColor: colors.green,
    paddingTop: 14,
    paddingBottom: 14,
    textAlign: "center",
    width: "100%",
    borderRadius: 8,
    color: colors.white,
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
});
