import { useAuth } from "@/src/context/AuthContext";
import { Avatar } from "react-native-paper";

const InitialsAvatar = () => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "DM";
    const names = name.trim().split(" ");
    const initials = names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return initials.slice(0, 2);
  };

  return <Avatar.Text size={100} label={getInitials(user?.email || "")} />;
};

export default InitialsAvatar;
