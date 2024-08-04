import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 14,
    paddingRight: 14,
  },
  header: {
    fontSize: 30,
    color: "#1f30fb",
    fontFamily: "Poppins-Bold",
  },
  subheader: {
    fontSize: 15,
    marginTop: 10,
    color: "black",
  },
  demoGifContainer: {
    width: 220,
    height: 480,
  },
  demoGif: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
