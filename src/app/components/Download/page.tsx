import APK_URLS from "@/constants/apkLinks";
import colors from "@/constants/colors";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

const APK_NAME = "painel.apk";
type UserRole = "premium" | "free" | null;

interface DownloadButtonProps {
  userRole: UserRole;
}

export default function DownloadButton({ userRole }: DownloadButtonProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    try {
      setIsDownloading(true);
      const fileUri = getDownloadPath();

      const downloadResponse = await startDownload(fileUri);
      if (!downloadResponse?.uri)
        throw new Error("Download failed: Empty URI.");

      resetDownloadState();
      await installAPK(downloadResponse.uri);
    } catch (error) {
      handleError("Download Error", "Failed to download APK.");
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
