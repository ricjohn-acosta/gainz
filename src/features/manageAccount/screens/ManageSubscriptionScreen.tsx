import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MenuActionButton } from "../../../components/Button/MenuActionButton.tsx";
import { ChangeSubscriptionBottomSheet } from "../Components/ManageSubscriptionScreen/ChangeSubscriptionBottomSheet.tsx";
import { DescriptiveText } from "../../../components/Text/DescriptiveText.tsx";
import useProfileStore from "../../../stores/profileStore.ts";

export const ManageSubscriptionScreen = () => {
  const {
    data: { subscription },
  } = useProfileStore();

  const [changeSubscription, setChangeSubscription] = useState<boolean>(false);

  const displayCurrentSubscription = () => {
    if (!subscription) return;

    return `${subscription.metadata.seats} member seats at $${subscription.items.data[0].quantity}.00 per month`;
  };

  return (
    <View style={styles.container}>
      <DescriptiveText
        subtitleStyle={styles.subtitle}
        title={"Current subscription"}
        subtitle={displayCurrentSubscription()}
      />
      <MenuActionButton
        label={"Change subscription"}
        onPress={() => {
          setChangeSubscription(true);
        }}
      />
      <MenuActionButton
        labelStyle={styles.cancelSubscriptionLabel}
        label={"Cancel subscription"}
        onPress={() => {}}
      />

      <ChangeSubscriptionBottomSheet
        open={changeSubscription}
        onDismiss={() => setChangeSubscription(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  cancelSubscriptionLabel: {
    color: "red",
  },
  subtitle: {
    color: "#1f30fb",
  },
});
