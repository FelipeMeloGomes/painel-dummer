import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  View
} from "react-native";
import { Button } from "react-native-paper";

const APK_NAME = "painel.apk";
const APK_URL =
  "https://uhteeunwizzmxlmjaidz.supabase.co/storage/v1/object/sign/apk/painel.apk?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcGsvcGFpbmVsLmFwayIsImlhdCI6MTc0MTM5OTAyMSwiZXhwIjoxNzcyOTM1MDIxfQ.KgzGxMiqtzDYE6W6oP6V_h9EBr5wI9LoDuUgy-E9oQg";

export default function DownloadButton() {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const formattedProgress = progressPercentage
    .toFixed(2)
    .toString()
    .slice(0, 4);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    try {
      setIsDownloading(true);
      const fileUri = getDownloadPath();
      logMessage("Iniciando download para:", fileUri);

      const downloadResponse = await startDownload(fileUri);
      if (!downloadResponse?.uri)
        throw new Error("Download falhou: URI de resposta vazia.");

      logMessage("Download concluído:", downloadResponse.uri);
      resetDownloadState();
      await installAPK(downloadResponse.uri);
    } catch (error) {
      handleError(
        "Erro no download",
        error,
        "Erro ao baixar",
        "Não foi possível baixar o APK.",
      );
    }
  }

  function onDownloadProgress({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }: FileSystem.DownloadProgressData) {
    const percentage = calculateProgress(
      totalBytesWritten,
      totalBytesExpectedToWrite,
    );
    logMessage(`Progresso do download: ${percentage.toFixed(2)}%`);
    setProgressPercentage(percentage);
  }

  async function installAPK(uri: string) {
    if (Platform.OS !== "android")
      return Alert.alert(
        "Aviso",
        "A instalação automática só funciona no Android.",
      );

    try {
      logMessage("Iniciando instalação do APK:", uri);
      if (!(await fileExists(uri))) throw new Error("APK não encontrado.");

      await Sharing.shareAsync(uri, {
        mimeType: "application/vnd.android.package-archive",
      });
    } catch (error) {
      handleError(
        "Erro ao iniciar instalação",
        error,
        "Erro",
        "Não foi possível iniciar a instalação do APK.",
      );
    }
  }

  function getDownloadPath(): string {
    return FileSystem.documentDirectory + APK_NAME;
  }

  async function startDownload(fileUri: string) {
    const downloadResumable = FileSystem.createDownloadResumable(
      APK_URL,
      fileUri,
      {},
      onDownloadProgress,
    );
    return await downloadResumable.downloadAsync();
  }

  function calculateProgress(written: number, expected: number): number {
    return (written / expected) * 100;
  }

  async function fileExists(uri: string): Promise<boolean> {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.exists;
  }

  function resetDownloadState() {
    setProgressPercentage(0);
    setIsDownloading(false);
  }

  function logMessage(...messages: any[]) {
    console.log(...messages);
  }

  function handleError(
    logPrefix: string,
    error: any,
    alertTitle: string,
    alertMessage: string,
  ) {
    console.error(logPrefix, error);
    Alert.alert(alertTitle, error.message || alertMessage);
  }

  return (
    <View>
      <Button
        mode="contained"
        loading={isDownloading}
        onPress={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            {formattedProgress}% baixando...
            <ActivityIndicator color="#000" size="small" />
          </>
        ) : (
          "Download PAINEL"
        )}
      </Button>
    </View>
  );
}
