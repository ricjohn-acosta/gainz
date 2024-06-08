import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import BasicText from "../../components/Text/BasicText.tsx";
import { LinearGradient } from "expo-linear-gradient";
import { Checkbox } from "expo-checkbox";
import { PrimaryButton } from "../../components/Button/PrimaryButton.tsx";
import React, { useState } from "react";
import images from "../../../assets/index.ts";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { supabase } from "../../services/supabase.ts";
import useProfileStore from "../../stores/profileStore.ts";
import { useNavigation } from "@react-navigation/native";
import { TextButton } from "../../components/Button/TextButton.tsx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const FIXED_MEMBER_SUBSCRIPTION = "3_MEMBER";
const CUSTOM_MEMBER_SUBSCRIPTION = "CUSTOM_MEMBER";
const FREE_SEAT = 3;

// This screen only shows for users who are going to subscribe for the first time
export const SubscribeModalScreen = () => {
  const {
    operations: { getSubscription },
  } = useProfileStore();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const navigation = useNavigation<any>();

  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [customMemberAmount, setCustomMemberAmount] = useState("5");
  const [loading, setLoading] = useState(false);

  const displayFinalQuantity = () => {
    if (!selectedSubscription) return "Continue to checkout!";

    if (selectedSubscription === FIXED_MEMBER_SUBSCRIPTION) {
      return `Add 3 member seats for free!`;
    }

    if (selectedSubscription === CUSTOM_MEMBER_SUBSCRIPTION) {
      if (Number(customMemberAmount) <= FREE_SEAT) {
        return `Add ${customMemberAmount} member seats for free!`;
      } else {
        return `Continue to checkout ($${Number(customMemberAmount) - FREE_SEAT}.00)`;
      }
    }
  };

  const initializePaymentSheet = async () => {
    // Amount of member seats the user purchases
    const seats =
      selectedSubscription === FIXED_MEMBER_SUBSCRIPTION
        ? "3"
        : customMemberAmount;

    // Amount the user has to pay
    const quantity =
      selectedSubscription === FIXED_MEMBER_SUBSCRIPTION
        ? 0
        : Number(customMemberAmount) <= 3
          ? 0
          : Number(customMemberAmount) - 3;

    const {
      data: { paymentIntent, ephemeralKey, customer },
      error: supabaseError,
    } = await supabase.functions.invoke("stripe-payment-sheet", {
      body: { quantity, seats },
    });

    if (!paymentIntent) {
      // Payment completed - show a confirmation screen.
      Alert.alert("Thank you!", "You may now add more members in your team.");
      getSubscription().then((error) => {
        if (!error) navigation.goBack();
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

    if (supabaseError) {
      console.error(supabaseError);
      return supabaseError;
    }

    if (stripeError) {
      console.error(stripeError);
      return stripeError;
    }
  };

  const presentStripePaymentSheet = async () => {
    setLoading(true);
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
      setLoading(false);
    });
  };

  const handleCustomMemberAmountChange = (text) => {
    // Filter out any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText === "" || numericText === "0") {
      setCustomMemberAmount("");
      return;
    }

    setCustomMemberAmount(numericText);
  };

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.background} colors={["#004e92", "#000428"]}>
        <KeyboardAwareScrollView>
          <View style={styles.cancelContainer}>
            <TextButton
              onPress={() => navigation.goBack()}
              textStyle={{ color: "#ffffff" }}
              text={"Cancel"}
              disabled={loading}
            />
          </View>

          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={images.kapaiiSquareLogo} />
          </View>

          <View style={styles.headerContainer}>
            <BasicText style={styles.header}>First 3 members free!</BasicText>
            <BasicText style={styles.subheader}>
              Purchase member seats and start celebrating your team 💪
            </BasicText>
          </View>

          <View style={styles.pricingContainer}>
            <BasicText style={styles.price}>$1</BasicText>
            <BasicText style={styles.priceDetails}>per member/month</BasicText>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.itemContainer}>
                <Checkbox
                  value={selectedSubscription === FIXED_MEMBER_SUBSCRIPTION}
                  onValueChange={() =>
                    setSelectedSubscription(FIXED_MEMBER_SUBSCRIPTION)
                  }
                />
                <BasicText>3 members</BasicText>
              </View>
              <BasicText style={styles.pricingLabel}>FREE!</BasicText>
            </View>

            <View style={styles.card}>
              <View style={styles.itemContainer}>
                <Checkbox
                  value={selectedSubscription === CUSTOM_MEMBER_SUBSCRIPTION}
                  onValueChange={() =>
                    setSelectedSubscription(CUSTOM_MEMBER_SUBSCRIPTION)
                  }
                />
                <BasicText styles={styles.itemName}>Custom amount</BasicText>
              </View>
              <View style={styles.customAmountContainer}>
                <BasicText>$</BasicText>
                <TextInput
                  value={customMemberAmount}
                  keyboardType={"numeric"}
                  inputMode={"numeric"}
                  onChangeText={handleCustomMemberAmountChange}
                  placeholder={"5"}
                  style={styles.customAmountInput}
                />
                <BasicText>/month</BasicText>
              </View>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <BasicText style={styles.loadingMessage}>
                Please stay put! We're doing some magic in the background..
              </BasicText>
              <ActivityIndicator size={"large"} />
            </View>
          ) : (
            <PrimaryButton
              onPress={presentStripePaymentSheet}
              disabled={
                !selectedSubscription ||
                (selectedSubscription === CUSTOM_MEMBER_SUBSCRIPTION &&
                  !customMemberAmount)
              }
              text={displayFinalQuantity()}
            />
          )}

          <BasicText style={styles.checkoutWarning}>
            You won't be charged yet
          </BasicText>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    padding: 20,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  subheader: {
    textAlign: "center",
    fontSize: 16,
    color: "#d2d2d2",
  },
  pricingContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  price: {
    color: "#ffffff",
    fontSize: 60,
    fontFamily: "Poppins-Bold",
  },
  priceDetails: {
    color: "#b9b9b9",
  },
  cardContainer: {
    marginTop: 50,
    marginBottom: 50,
  },
  itemContainer: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#6e6e6e",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  customAmountContainer: {
    flexDirection: "row",
    gap: 4,
  },
  customAmountInput: {
    minWidth: 20,
    borderColor: "#d2d2d2",
    borderStyle: "solid",
    borderRadius: 4,
    borderWidth: 1,
    textAlign: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    borderRadius: 20,
    width: 80,
    height: 80,
  },
  checkoutWarning: {
    fontSize: 12,
    marginTop: 8,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    color: "#ffffff",
  },
  pricingLabel: {
    color: "#1f30fb",
    fontFamily: "Poppins-Bold",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingMessage: {
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    color: "#ffffff",
  },
  cancelContainer: {
    alignItems: "flex-end",
  },
});
