import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import useRewardStore from "../../../stores/rewardStore";
import { Checkbox } from "expo-checkbox";
import { TextButton } from "../../../components/Button/TextButton";
import { useNavigation } from "@react-navigation/native";
import BasicText from "../../../components/Text/BasicText";

export const DeleteRewardList = () => {
  const {
    data: { rewards },
    operations: { deleteReward },
  } = useRewardStore();
  const navigation = useNavigation<any>();

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectCheckbox = (rewardId) => {
    if (!!selectedIds.find((id) => id === rewardId)) {
      setSelectedIds(selectedIds.filter((id) => id !== rewardId));
      return;
    }
    setSelectedIds([...selectedIds, rewardId]);
  };

  const handleDeleteReward = async () => {
    if (selectedIds.length === 0) return;
    const error = await deleteReward(selectedIds);

    if (error) {
      console.error(error)
    }

    navigation.getParent().goBack()
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ marginRight: 16 }}>
            <TextButton
              disabled={selectedIds.length === 0}
              onPress={handleDeleteReward}
              textStyle={{ color: "#1f30fb" }}
              text={"Delete"}
            />
          </View>
        );
      },
    });
  }, [selectedIds]);

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <BasicText style={styles.title}>Delete rewards</BasicText>
        <BasicText style={styles.subtitle}>
          Select rewards that you wish to be deleted.
        </BasicText>
      </View>

      {rewards.map((reward) => {
        return (
          <View style={styles.parentContainer}>
            <View style={styles.rewardItemContainer}>
              <BasicText style={styles.rewardName}>{reward.name}</BasicText>
              <BasicText style={styles.rewardDescription}>{reward.description}</BasicText>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={!!selectedIds.find((id) => id === reward.id)}
                onValueChange={() => handleSelectCheckbox(reward.id)}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  parentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rewardItemContainer: { marginBottom: 20 },
  rewardName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  rewardDescription: {
    color: "grey",
    marginBottom: 6,
    fontSize: 14
  },
  checkboxContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    marginBottom: 24,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
});
