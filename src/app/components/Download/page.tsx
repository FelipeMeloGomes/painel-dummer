import APK_URLS from "@/constants/apkLinks";
import colors from "@/constants/colors";
import { supabase } from "@/src/lib/supabase";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

const APK_NAME = "painel.apk";
const MAX_DOWNLOADS = 4;
type UserRole = "premium" | "free" | null;

interface DownloadButtonProps {
  userRole: UserRole;
  userId: string;
}

export default function DownloadButton({
  userRole,
  userId,
}: DownloadButtonProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDownloadCount = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("download_count")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar downloads:", error);
        return;
      }

      setDownloadCount(data?.download_count ?? 0);
    };

    fetchDownloadCount();
  }, [userId]);

  async function handleDownload() {
    if (downloadCount !== null && downloadCount >= MAX_DOWNLOADS) {
      Alert.alert(
        "Limite de downloads atingido",
        "Você já alcançou o limite de downloads.",
      );
      return;
    }

    try {
      setIsDownloading(true);
      const fileUri = getDownloadPath();

      const downloadResponse = await startDownload(fileUri);
      if (!downloadResponse?.uri)
        throw new Error("Download failed: Empty URI.");

      resetDownloadState();
      await installAPK(downloadResponse.uri);

      if (downloadCount !== null) {
        const newDownloadCount = downloadCount + 1;
        setDownloadCount(newDownloadCount);

        const { data, error } = await supabase
          .from("users")
          .update({ download_count: newDownloadCount })
          .eq("id", userId);

        if (error) {
          throw new Error("Erro ao atualizar download_count no Supabase.");
        } else {
          console.log("Contagem de downloads atualizada no Supabase:", data);
        }
      }
    } catch (error) {
      handleError(
        "Download Error",
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    }
  }

  function onDownloadProgress({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }: FileSystem.DownloadProgressData) {
    const percentage = (totalBytesWritten / totalBytesExpectedToWrite) * 100;
    setProgressPercentage(percentage);
  }

  async function installAPK(uri: string) {
    if (Platform.OS !== "android") {
      Alert.alert(
        "Warning",
        "Automatic installation is only available on Android.",
      );
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error("APK file not found.");

      await Sharing.shareAsync(uri, {
        mimeType: "application/vnd.android.package-archive",
      });
    } catch (error) {
      handleError("Installation Error", "Failed to start APK installation.");
    }
  }

  function getDownloadPath() {
    return FileSystem.documentDirectory + APK_NAME;
  }

  async function startDownload(fileUri: string) {
    const downloadResumable = FileSystem.createDownloadResumable(
      APK_URLS[userRole || "free"],
      fileUri,
      {},
      onDownloadProgress,
    );
    return await downloadResumable.downloadAsync();
  }

  function resetDownloadState() {
    setProgressPercentage(0);
    setIsDownloading(false);
  }

  function handleError(title: string, message: string) {
    Toast.show({
      type: "error",
      position: "bottom",
      text1: title,
      text2: message,
    });
  }

  return (
    <Button
      mode="contained"
      loading={isDownloading}
      onPress={handleDownload}
      disabled={isDownloading}
      buttonColor={colors.green}
      icon="download"
      style={styles.button}
    >
      {isDownloading ? (
        <>
          {progressPercentage.toFixed(2)}% downloading...
          <ActivityIndicator color="#000" size="small" />
        </>
      ) : (
        `Download ${userRole === "premium" ? "Premium" : "Free"} APK`
      )}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
});
