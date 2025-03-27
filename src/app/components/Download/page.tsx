import colors from "@/constants/colors";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import useDownloadAPK from "../../hooks/useDownloadAPK";

interface DownloadButtonProps {
  userRole: "premium" | "free" | null;
  userId: string;
}

export default function DownloadButton({
  userRole,
  userId,
}: DownloadButtonProps) {
  const {
    progressPercentage,
    isDownloading,
    handleDownload,
    downloadCount,
    MAX_DOWNLOADS,
  } = useDownloadAPK(userRole, userId);
  const hasReachedLimit =
    downloadCount !== null && downloadCount >= MAX_DOWNLOADS;
  return (
    <Button
      mode="contained"
      loading={isDownloading}
      onPress={handleDownload}
      disabled={isDownloading || hasReachedLimit}
      buttonColor={hasReachedLimit ? colors.gray : colors.green}
      icon="download"
      style={styles.button}
    >
      {hasReachedLimit
        ? "Limite de downloads atingido"
        : isDownloading
          ? `${progressPercentage.toFixed(2)}% baixando...`
          : `Download ${userRole === "premium" ? "Premium" : "Free"} APK`}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
});
