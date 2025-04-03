import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

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
      showAlert("Erro", "Por favor, forneça um email.");
      return;
    }

    try {
      const userId = await fetchUserId(userEmail);
      if (!userId) return;

      const roleId = await fetchRoleId(newRole);
      if (!roleId) return;

      await updateUserRole(userId, roleId);
      await updateUserLicense(userId, newRole);

      showAlert(
        "Sucesso",
        "O papel e a licença do usuário foram alterados com sucesso!",
      );
    } catch (error) {
      showAlert("Erro", "Houve um problema ao alterar o papel do usuário.");
    }
  };

  const fetchUserId = async (email: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
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

  const updateUserLicense = async (
    userId: string,
    role: "premium" | "free",
  ) => {
    const expiresAt = role === "premium" ? new Date() : null;

    if (expiresAt) {
      expiresAt.setDate(expiresAt.getDate() + 30);
    }

    const { data: existingLicense } = await supabase
      .from("licenses")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingLicense) {
      await supabase
        .from("licenses")
        .update({
          type: role,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
        })
        .eq("user_id", userId);
    } else {
      await supabase.from("licenses").insert([
        {
          user_id: userId,
          type: role,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
        },
      ]);
    }
  };

  const showAlert = (title: string, message: string) => {
    Toast.show({
      type: title === "Erro" ? "error" : "success",
      position: "top",
      text1: title,
      text2: message,
      visibilityTime: 3000,
    });
  };

  return { setRoleChange: setTriggerChange };
}

export default useRoleChange;
