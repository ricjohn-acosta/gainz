import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tutorialContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    // backgroundColor: "#0070F7",
    // backgroundColor: "#1f30fb",
  },
  logo: {
    borderRadius: 20,
    width: 80,
    height: 80,
    marginBottom: 50,
  },
  welcomeTitle: {
    color: "#1f30fb",
    fontSize: 34,
    fontFamily: "Poppins-Bold",
  },
  label: {
    color: "black",
    marginTop: 30,
    marginBottom: 15,
  },
  tutorialButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
