import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

function useRoleChange(userEmail: string, newRole: "premium" | "free" | null) {
  const [triggerChange, setTriggerChange] = useState(false);

  useEffect(() => {
    if (triggerChange && newRole) {
      handleRoleChange();
      setTriggerChange(false);
    }
  }, [newRole, triggerChange]);

  const handleRoleChange = async () => {
    if (!userEmail || !newRole) {
      showAlert("Erro", "Por favor, forneça o nome do usuário e o novo papel.");
      return;
    }

    try {
      const userId = await fetchUserId(userEmail);
      if (!userId) return;

      const roleId = await fetchRoleId(newRole);
      if (!roleId) return;

      await updateUserRole(userId, roleId);
      showAlert("Sucesso", "O papel do usuário foi alterado com sucesso!");
    } catch (error) {
      showAlert("Erro", "Houve um problema ao alterar o papel do usuário.");
    }
  };

  const fetchUserId = async (email: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)
      .single();

    if (error || !data) {
      showAlert("Erro", "Usuário não encontrado.");
      return null;
    }

    return data.id;
  };

  const fetchRoleId = async (roleName: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (error || !data) {
      showAlert("Erro", "Erro ao buscar a role.");
      return null;
    }

    return data.id;
  };

  const updateUserRole = async (userId: string, roleId: string) => {
    const { error } = await supabase
      .from("users")
      .update({ role_id: roleId })
      .eq("id", userId);

    if (error) {
      showAlert("Erro", "Erro ao alterar o papel do usuário.");
      throw new Error("Failed to update user role");
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  return { setRoleChange: setTriggerChange };
}

export default useRoleChange;
