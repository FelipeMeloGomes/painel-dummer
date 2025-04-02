import colors from "@/constants/colors";
import React from "react";
import { Chip } from "react-native-paper";

interface RoleChipProps {
  isAdmin?: boolean;
  isPremium?: boolean;
}

const getRoleColor = (isAdmin: boolean, isPremium: boolean) => {
  if (isAdmin) return colors.red;
  if (isPremium) return colors.green;
  return colors.cyan;
};

const RoleChip: React.FC<RoleChipProps> = ({
  isAdmin = false,
  isPremium = false,
}) => {
  const roleText = isAdmin ? "Moderador" : isPremium ? "Premium" : "Free";
  const roleColor = getRoleColor(isAdmin, isPremium);

  return (
    <Chip
      mode="outlined"
      selected={isAdmin || isPremium}
      style={{ borderColor: roleColor }}
      textStyle={{ color: roleColor }}
    >
      {roleText}
    </Chip>
  );
};

export default RoleChip;
