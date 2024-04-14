import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import images from "../../../assets";

export const RewardCard = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.imageContainer} source={images.cashReward} />
      <View style={styles.cardDetails}>
        <View>
          <Text style={styles.title}>$25 in cash</Text>
          <Text style={styles.description}>
            Free $25 for you to spend on anything!
          </Text>
          <Text style={styles.itemStock}>Limited time stock</Text>
        </View>
        <TouchableOpacity>
          <View style={styles.redeemBtnContainer}>
            <Text style={styles.redeemBtnText}>250</Text>
            <MaterialIcons
              name="local-fire-department"
              size={30}
              color="#ff046d"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    marginBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardDetails: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    marginBottom: 20,
  },
  itemStock: {
    color: "grey",
  },
  redeemBtnContainer: {
    marginTop: 10,
    backgroundColor: "#1f30fb",
    borderRadius: 25,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  redeemBtnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});
