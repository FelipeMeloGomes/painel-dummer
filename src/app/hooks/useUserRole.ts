import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

type RoleName = "adm" | "premium" | "free";

const roles: Record<
  RoleName,
  { isAdmin: boolean; isPremium: boolean; isFree: boolean }
> = {
  adm: { isAdmin: true, isPremium: false, isFree: false },
  premium: { isAdmin: false, isPremium: true, isFree: false },
  free: { isAdmin: false, isPremium: false, isFree: true },
};

export const useUserRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [roleId, setRoleId] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (message: string) => {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Erro",
        text2: message,
      });
    };

    const checkUserInDatabase = async () => {
      if (!user || !user.id) {
        handleError("Você não está logado.");
        setIsAdmin(false);
        setIsPremium(false);
        setIsFree(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("role_id")
          .eq("id", user.id)
          .limit(1);

        if (error) {
          handleError("Ocorreu um erro ao verificar o status do usuário.");
          return;
        }

        if (data && data.length > 0) {
          const roleId = data[0]?.role_id;

          const { data: roleData, error: roleError } = await supabase
            .from("roles")
            .select("name")
            .eq("id", roleId)
            .single();

          if (roleError) {
            handleError("Ocorreu um erro ao buscar o papel do usuário.");
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
            resetRoleData();
          }
        } else {
          resetRoleData();
        }
      } catch (error) {
        handleError("Houve um problema ao buscar as informações do usuário.");
      }
    };

    const resetRoleData = () => {
      setIsAdmin(false);
      setIsPremium(false);
      setIsFree(false);
      setRoleId(null);
    };

    checkUserInDatabase();
  }, [user]);

  return { isAdmin, isPremium, isFree, roleId };
};

export default useUserRole;