import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 4,
    borderRadius: 16,
  },
  galleryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  galleryTitle: {
    fontSize: 14,
    color: "grey",
  },
  removeButton: {
    backgroundColor: "#ffffff",
    position: "absolute",
    borderRadius: 50,
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  assetIcon: {
    position: "absolute",
    top: 6,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageGalleryModalCloseButton: {
    position: "absolute",
    right: 10,
    top: 50,
    zIndex: 9999,
  },
});
