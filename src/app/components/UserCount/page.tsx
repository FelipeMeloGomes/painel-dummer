import React, { useState, useEffect } from "react";
import { Text } from "react-native-paper";
import { supabase } from "@/src/lib/supabase";

const UserCount = () => {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("Erro ao obter contagem de usuários:", error);
          return;
        }

        setUserCount(count);
      } catch (error) {
        console.error("Erro ao buscar número de usuários:", error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <Text>
      Total de Usuários Cadastrados:{" "}
      {userCount !== null ? userCount : "Carregando..."}
    </Text>
  );
};

export default UserCount;
