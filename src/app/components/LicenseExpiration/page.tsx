import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Chip } from "react-native-paper";

type License = {
  type: "premium" | "free";
  expires_at: string | null;
};

type LicenseExpirationProps = {
  userId: string | undefined;
};

export default function LicenseExpiration({ userId }: LicenseExpirationProps) {
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLicense(null);
      setLoading(false);
      return;
    }
    fetchLicense();
  }, [userId]);

  const fetchLicense = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("licenses")
      .select("type, expires_at")
      .eq("user_id", userId!)
      .maybeSingle();

    if (error) {
      setLicense(null);
    } else {
      setLicense(data);
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="small" color="#00ff00" />;

  return (
    <Chip>
      {license?.type === "premium"
        ? `Expira em: ${
            license.expires_at
              ? new Date(license.expires_at).toLocaleDateString("pt-BR")
              : "Desconhecido"
          }`
        : "Sem licença"}
    </Chip>
  );
}
