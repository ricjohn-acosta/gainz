import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import useRewardStore from "../../../stores/rewardStore";
import { Checkbox } from "expo-checkbox";
import { TextButton } from "../../../components/Button/TextButton";
import { useNavigation } from "@react-navigation/native";

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
        <Text style={styles.title}>Delete rewards</Text>
        <Text style={styles.subtitle}>
          Select rewards that you wish to be deleted.
        </Text>
      </View>

      {rewards.map((reward) => {
        return (
          <View style={styles.parentContainer}>
            <View style={styles.rewardItemContainer}>
              <Text style={styles.rewardName}>{reward.name}</Text>
              <Text style={styles.rewardDescription}>{reward.description}</Text>
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
    margin: 12,
  },
  parentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rewardItemContainer: { marginBottom: 20 },
  rewardName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
    marginBottom: 4,
  },
  rewardDescription: {
    color: "grey",
    marginBottom: 6,
  },
  checkboxContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
});
