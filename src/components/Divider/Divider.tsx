import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BasicText from "../Text/BasicText";

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
        <BasicText style={{ ...styles.title, ...titleStyle }}>
          {title}
        </BasicText>
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
    width: 60,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
  },
});
