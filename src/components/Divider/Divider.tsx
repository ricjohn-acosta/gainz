import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DividerProps {
  title: string;
  titleStyle?: any;
}

const Divider = (props: DividerProps) => {
  const { title, titleStyle } = props;
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

export default Divider;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#adadad",
  },
  title: {
    width: 100,
    textAlign: "center",
    fontWeight: "bold",
  },
});
