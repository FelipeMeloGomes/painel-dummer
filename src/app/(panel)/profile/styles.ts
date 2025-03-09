// styles.ts
import { StyleSheet } from "react-native";
import colors from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 34,
    backgroundColor: colors.zinc,
  },
  header: {
    paddingLeft: 14,
    paddingRight: 14,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 34,
    color: colors.white,
    marginBottom: 34,
  },
  buttons: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
    color: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 10,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
  },
  adminOptions: {
    marginTop: 20,
    width: "100%",
  },
  input: {
    marginBottom: 10,
  },
  roleButton: {
    marginBottom: 10,
  },
  changeRoleButton: {
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginTop: 30,
  },
});

export default styles;
