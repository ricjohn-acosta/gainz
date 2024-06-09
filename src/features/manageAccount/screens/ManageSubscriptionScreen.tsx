import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MenuActionButton } from "../../../components/Button/MenuActionButton.tsx";
import { ChangeSubscriptionBottomSheet } from "../Components/ManageSubscriptionScreen/ChangeSubscriptionBottomSheet.tsx";
import { DescriptiveText } from "../../../components/Text/DescriptiveText.tsx";
import useProfileStore from "../../../stores/profileStore.ts";
import { supabase } from "../../../services/supabase.ts";

export const ManageSubscriptionScreen = () => {
  const {
    data: { subscription },
    operations: { getSubscription },
  } = useProfileStore();

  const [changeSubscription, setChangeSubscription] = useState<boolean>(false);

  const displayCurrentSubscription = () => {
    if (!subscription) return;

    return `${subscription.metadata.seats} member seats at $${subscription.items.data[0].quantity}.00 per month`;
  };

  const displayCancelSubscription = () => {
    if (!subscription) return;

    if (subscription.items.data[0].quantity !== 0) {
      return true;
    }

    return false;
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel subscription?",
      `Giving hype to members will temporarily be disabled.`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            cancelSubscription();
          },
        },
      ],
    );
  };

  const cancelSubscription = async () => {
    const { error: fnError } = await supabase.functions.invoke(
      "stripe-cancel-subscription",
      {
        body: { subscriptionId: subscription.id },
      },
    );

    if (fnError) {
      Alert.alert("Unable to cancel subscription");
      return;
    }

    // Refresh sub
    getSubscription().then((_) => {
      Alert.alert("Subscription cancelled!", "You will not be charged again.");
    });
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
      {displayCancelSubscription() && (
        <MenuActionButton
          labelStyle={styles.cancelSubscriptionLabel}
          label={"Cancel subscription"}
          onPress={handleCancelSubscription}
        />
      )}

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
