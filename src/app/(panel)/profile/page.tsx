import colors from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import DownloadButton from "../../components/Download/page";

export default function Profile() {
  const { setAuth, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (user && user.id) {
        try {
          const { data, error, status } = await supabase
            .from("users")
            .select("roles")
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
            const role = data[0]?.roles;

            if (typeof role === "boolean") {
              setIsAdmin(role);
            } else {
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          Alert.alert(
            "Erro",
            "Houve um problema ao buscar as informações do usuário.",
          );
        }
      } else {
        Alert.alert("Erro", "Você não está logado.");
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
        <Text style={styles.slogan}>Painel</Text>
      </View>

      <View style={styles.buttons}>
        {isAdmin && (
          <Link href="/(auth)/signup/page" style={styles.link}>
            <Text>Cadastrar USUÁRIO</Text>
          </Link>
        )}
        <DownloadButton />
        <Button title="Sair" onPress={handleSignout} />
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
    color: colors.white
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
