import colors from "@/constants/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 34,
    backgroundColor: colors.zinc,
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
    padding: 20,
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
    justifyContent: "flex-start",
  },
  containerBtn: {
    flexDirection: "column",
    padding: 20,
    marginTop: 20,
  },
  countContainer: {
    marginTop: 20,
  },
});

export default styles;
