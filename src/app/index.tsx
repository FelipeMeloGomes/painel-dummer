import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import Toast from "react-native-toast-message";
import { PaperProvider } from "react-native-paper";

export default function Index() {
  return (
    <PaperProvider>
      <Toast />
      <View style={styles.container}>
        <ActivityIndicator size={44} color={colors.green} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc,
    justifyContent: "center",
    alignItems: "center",
  },
});
