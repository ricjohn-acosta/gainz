import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 300,
  },
  multipleAssetsIndicator: {
    zIndex: 9999,
    backgroundColor: "#f2f4ff",
    position: "absolute",
    borderRadius: 10,
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 0,
  },
});
