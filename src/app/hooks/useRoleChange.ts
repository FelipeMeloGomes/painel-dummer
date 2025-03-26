import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

function useRoleChange(userEmail: string, newRole: "premium" | "free" | null) {
  const [triggerChange, setTriggerChange] = useState(false);

  useEffect(() => {
    if (triggerChange && newRole) {
      changeUserRole();
      setTriggerChange(false);
    }
  }, [newRole, triggerChange]);

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

      Alert.alert("Sucesso", `O papel do usuário foi alterado com sucesso!`);
    } catch (error) {
      Alert.alert("Erro", "Houve um problema ao alterar o papel do usuário.");
    }
  };

  return { setRoleChange: setTriggerChange };
}

export default useRoleChange;
