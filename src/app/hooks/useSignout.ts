import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import Toast from "react-native-toast-message";

function useSignOut() {
  const { setAuth } = useAuth();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    setAuth(null);

    if (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Erro",
        text2: "Erro ao sair da conta, tente mais tarde.",
      });
      return;
    }
  };

  return { handleSignout };
}

export default useSignOut;
