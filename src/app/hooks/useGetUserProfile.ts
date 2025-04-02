import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

function useUserProfile() {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("Usuário não autenticado");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
      } else {
        setName(data?.name || null);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { name, loading };
}

export default useUserProfile;
