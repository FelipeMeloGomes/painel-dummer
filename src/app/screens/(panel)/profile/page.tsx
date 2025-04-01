import colors from "@/constants/colors";
import useRoleChange from "@/src/app/hooks/useRoleChange";
import useSignOut from "@/src/app/hooks/useSignout";
import { useAuth } from "@/src/context/AuthContext";
import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Text,
  TextInput,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import DownloadButton from "../../../components/Download/page";
import UserCount from "../../../components/UserCount/page";
import { useUserRole } from "../../../hooks/useUserRole";
import styles from "./styles";

export default function Profile() {
  const { setAuth, user } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [newRole, setNewRole] = useState<"premium" | "free" | null>(null);
  const { isAdmin, isPremium } = useUserRole();
  const { setRoleChange } = useRoleChange(userEmail, newRole);
  const { handleSignout } = useSignOut();

  const handleRoleChange = (role: "premium" | "free") => {
    setNewRole(role);
    setRoleChange(true);
  };

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
              {user ? (
                isAdmin ? (
                  <>
                    <DownloadButton userRole="premium" userId={user.id} />
                    <DownloadButton userRole="free" userId={user.id} />
                  </>
                ) : (
                  <DownloadButton
                    userRole={isPremium ? "premium" : "free"}
                    userId={user.id}
                  />
                )
              ) : (
                <ActivityIndicator size="large" />
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
      <Toast />
    </SafeAreaView>
  );
}
