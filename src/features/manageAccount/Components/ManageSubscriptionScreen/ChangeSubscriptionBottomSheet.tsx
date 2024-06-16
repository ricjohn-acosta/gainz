import React, { useEffect, useRef, useState } from "react";
import BasicBottomSheet from "../../../../components/BottomSheet/BasicBottomSheet.tsx";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import BasicText from "../../../../components/Text/BasicText.tsx";
import { PrimaryButton } from "../../../../components/Button/PrimaryButton.tsx";
import useProfileStore from "../../../../stores/profileStore.ts";
import { supabase } from "../../../../services/supabase.ts";
import { FREE_SEAT } from "../../../subscribe/SubscribeModalScreen.tsx";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";

interface ChangeSubscriptionBottomSheetProps {
  open: boolean;
  onDismiss: () => void;
}

export const ChangeSubscriptionBottomSheet = (
  props: ChangeSubscriptionBottomSheetProps,
) => {
  const { open, onDismiss } = props;

  const {
    operations: { getSubscription },
    data: { subscription },
  } = useProfileStore();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const bottomsheetRef = useRef<BottomSheetModal>(null);

  const [customMemberAmount, setCustomMemberAmount] = useState("10");
  const [updatingSubscription, setUpdatingSubscription] =
    useState<boolean>(false);

  useEffect(() => {
    if (open) {
      bottomsheetRef.current.present();
    } else {
      bottomsheetRef.current.dismiss();
    }
  }, [open]);

  const handleCustomMemberAmountChange = (text) => {
    // Filter out any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText === "" || numericText === "0") {
      setCustomMemberAmount("");
      return;
    }

    setCustomMemberAmount(numericText);
  };

  const displayDowngradeWarning = () => {
    if (!subscription) return;
    const currentSubscription = subscription.items.data[0].quantity;

    return Number(customMemberAmount) < currentSubscription;
  };

  const handleChangeSubscription = () => {
    Alert.alert(
      "Change subscription?",
      "Are you sure you want to change your subscription?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            updateSubscription();
          },
        },
      ],
    );
  };

  const initializePaymentSheet = async () => {
    // Amount of member seats the user purchases
    const seats =
      Number(customMemberAmount) <= FREE_SEAT ? "3" : customMemberAmount;

    // Amount the user has to pay
    const quantity =
      Number(customMemberAmount) <= FREE_SEAT
        ? 0
        : Number(customMemberAmount) - 3;

    const {
      data: { paymentIntent, ephemeralKey, customer },
      error: fnError,
    } = await supabase.functions.invoke("stripe-update-user-subscription", {
      body: { quantity, seats },
    });

    if (fnError) {
      Alert.alert(
        "Something went wrong changing your subscription!",
        fnError.message,
      );
      return;
    }

    if (!paymentIntent) {
      Alert.alert("Thank you!", "Subscription changed successfully");
      getSubscription().then((error) => {
        if (!error) setLoading(false);
      });
      return;
    }

    const { error: stripeError } = await initPaymentSheet({
      merchantDisplayName: "Kapaii",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
      primaryButtonLabel: `Subscribe for $${quantity}.00/month`, // Custom button label,
    });

    if (stripeError) {
      Alert.alert(
        "Something went wrong changing your subscription!",
        stripeError.message,
      );
    }
  };

  const updateSubscription = async () => {
    setUpdatingSubscription(true);
    initializePaymentSheet().then(async () => {
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === PaymentSheetError.Canceled) {
          // Customer canceled - you should probably do nothing.
        } else {
          // PaymentSheet encountered an unrecoverable error. You can display the error to the user, log it, etc.
        }
      } else {
        // Payment completed - show a confirmation screen.
        Alert.alert(
          "Thank you!",
          "Purchase successful. You may now add more members in your team.",
        );
        getSubscription().then((error) => {
          if (!error) navigation.goBack();
        });
      }
      setUpdatingSubscription(false);
    });
  };

  const isConfirmBtnDisabled = () => {
    if (!subscription) return;
    const currentSubscription = subscription.items.data[0].quantity;

    return (
      !customMemberAmount ||
      Number(customMemberAmount) - FREE_SEAT === currentSubscription ||
      Number(customMemberAmount) <= FREE_SEAT
    );
  };

  return (
    <BasicBottomSheet
      enablePanDownToClose={!updatingSubscription}
      onDismiss={onDismiss}
      ref={bottomsheetRef}
      _snapPoints={["70%"]}
    >
      <View style={styles.container}>
        <BasicText style={styles.modalTitle}>Change subscription</BasicText>
        <BasicText style={styles.subtitle}>
          Your change will be applied on your next payment.
        </BasicText>
        <View style={styles.customAmountInputContainer}>
          <BasicText style={styles.amountText}>$</BasicText>
          <BottomSheetTextInput
            value={customMemberAmount}
            onChangeText={handleCustomMemberAmountChange}
            keyboardType={"numeric"}
            inputMode={"numeric"}
            placeholder={"10"}
            style={styles.customAmountInput}
          />
          <BasicText style={styles.currency}>nzd</BasicText>
        </View>
        <BasicText style={styles.amountLabel}>per member/month</BasicText>
        <BasicText style={styles.discountMsg}>*3 members free!</BasicText>

        {displayDowngradeWarning() && (
          <BasicText style={styles.warningMsg}>
            *You are downgrading your subscription. If you proceed, you may need
            to remove members from your team to continue giving hype.
          </BasicText>
        )}
        {updatingSubscription && (
          <View style={styles.loadingContainer}>
            <BasicText style={styles.loadingText}>
              Changing your subscription...
            </BasicText>
            <ActivityIndicator size={"small"} />
          </View>
        )}

        {!updatingSubscription && (
          <View style={styles.changeSubBtnContainer}>
            <PrimaryButton
              disabled={isConfirmBtnDisabled()}
              onPress={handleChangeSubscription}
              style={styles.changeSubBtn}
              text={`Change subscription (Total: $${Number(customMemberAmount) - FREE_SEAT < 0 ? 0 : Number(customMemberAmount) - FREE_SEAT}.00)`}
            />
          </View>
        )}

      </View>
    </BasicBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    color: "grey",
    marginTop: 6,
  },
  customAmountInputContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  customAmountInput: {
    minWidth: 20,
    borderColor: "#d2d2d2",
    borderStyle: "solid",
    borderRadius: 4,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 50,
    height: "100%",
    fontFamily: "Poppins-Bold",
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  amountText: {
    fontSize: 50,
    fontFamily: "Poppins-Bold",
  },
  amountLabel: {
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    color: "grey",
  },
  currency: {
    marginLeft: 6,
    fontFamily: "Poppins-Bold",
  },
  changeSubBtnContainer: {
    margin: 20,
  },
  changeSubBtn: {
    width: "100%",
  },
  warningMsg: {
    color: "#ff3d02",
    marginTop: 20,
    fontSize: 11,
  },
  discountMsg: {
    textAlign: "center",
    color: "#1f30fb",
    fontSize: 11,
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#1f30fb",
    fontFamily: "Poppins-Bold",
  },
});
