import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PDF_NAME = "painel.apk";
const PDF_URI =
  "https://download1478.mediafire.com/3wuqg2j3bfmgZn1QxKVltDmM7Fl7Ah4e6RHk5plyiFfiuKIKoZuyg5F-E_N001FKWoPXR1rsP2vvcTJsge9stMX2L2pbwzUKygMwbiIoARE4PfkGCgTymqPXuNz3UhIJBaP7_HPgRRLbSD-B0A_Yk60AgFM6Sf5Fo111PZ5MoKXBEA/jmjnafgt9serk6z/base.apk";

export default function DownloadButton() {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  function onDownloadProgress({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }: FileSystem.DownloadProgressData) {
    const percentage = (totalBytesWritten / totalBytesExpectedToWrite) * 100;
    setProgressPercentage(percentage);
  }

  async function handleDownload() {
    try {
      setIsDownloading(true);

      const fileUri = FileSystem.documentDirectory + PDF_NAME;

      const downloadResumable = FileSystem.createDownloadResumable(
        PDF_URI,
        fileUri,
        {},
        onDownloadProgress,
      );

      const downloadResponse = await downloadResumable.downloadAsync();

      if (downloadResponse?.uri) {
        await fileSave(downloadResponse.uri, PDF_NAME);
        setProgressPercentage(0);
        setIsDownloading(false);
      }
    } catch (error) {
      Alert.alert("Download", "Não foi possível realizar o download.");
      console.error(error);
    }
  }

  async function fileSave(uri: string, filename: string) {
    if (Platform.OS === "android") {
      const directoryUri = FileSystem.cacheDirectory + filename;
      const base64File = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(directoryUri, base64File, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(directoryUri);
    } else {
      Sharing.shareAsync(uri);
    }
  }

  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#6a5acd",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    progress: {
      marginTop: 32,
      fontSize: 16,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Download PAINEL</Text>
        )}
      </TouchableOpacity>

      {progressPercentage > 0 && (
        <Text style={styles.progress}>
          {progressPercentage.toFixed(1)}% baixando...
        </Text>
      )}
    </View>
  );
}
