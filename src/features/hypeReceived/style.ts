import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},
  sheetContainer: {
    marginHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  senderName: {
    color: "#ff046d",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  defaultText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  hypeContentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginTop: 30,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffebf3",
    borderRadius: 50,
    padding: 16,
  },
  hypeReceivedContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  hypeReceived: {
    height: 30,
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#ff046d",
  },
  hypeReceivedLabel: {
    fontSize: 10,
    color: "#ff046d",
  },
  hypeReceivedMessage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff046d",
  },
  counter: {
    color: "grey",
    fontSize: 12,
    marginTop: 6,
  },
  actionContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
