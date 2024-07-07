import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import BasicText from "../../components/Text/BasicText.tsx";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "../../components/Button/PrimaryButton.tsx";
import React, { useCallback, useState } from "react";
import images from "../../../assets/index.ts";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { supabase } from "../../services/supabase.ts";
import useProfileStore from "../../stores/profileStore.ts";
import { useNavigation } from "@react-navigation/native";
import { TextButton } from "../../components/Button/TextButton.tsx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useTeamStore from "../../stores/teamStore.ts";
import Purchases from "react-native-purchases";
import useSubscriptionStore from "../../stores/subscriptionStore.ts";
import { Checkbox } from "expo-checkbox";

export const FIXED_MEMBER_SUBSCRIPTION = "3_MEMBER";
export const FREE_SEAT = 3;

// This screen only shows for users who are going to subscribe for the first time
export const SubscribeModalScreen = () => {
  const {
    data: { me, subscription },
    operations: { getSubscription },
  } = useProfileStore();
  const {
    data: { myTeam },
  } = useTeamStore();
  const {
    data: { offerings, customer },
    operations: { saveUserSubscriptionId },
  } = useSubscriptionStore();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [agreeTOS, setAgreeTOS] = useState(false);

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

  const renderHeroMessage = () => {
    if (!subscription) {
      return (
        <View style={styles.headerContainer}>
          <BasicText style={styles.header}>Subscribe for more!</BasicText>
          <BasicText style={styles.subheader}>
            Get unlimited member space and more! 🎉
          </BasicText>
        </View>
      );
    }

    const seats =
      subscription.metadata.seats -
      myTeam.filter((user) => user.profile_id !== me.id).length;

    if (seats === 0) {
      return (
        <View style={styles.headerContainer}>
          <BasicText style={styles.header}>Purchase more seats</BasicText>
          <BasicText style={styles.subheader}>
            Not enough member seats! Purchase more to continue celebrating your
            team 💪
          </BasicText>
        </View>
      );
    }
  };

  const renderOfferings = () => {
    if (
      offerings.current !== null &&
      offerings.current.availablePackages.length !== 0
    ) {
      // Display packages for sale
      return offerings.current.availablePackages.map((offering) => {
        return (
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.productHeader}>
                <BasicText style={styles.productTitle}>
                  {offering.product.title}
                </BasicText>
              </View>

              <View style={styles.productBodyContainer}>
                <BasicText style={styles.price}>
                  {offering.product.priceString}
                  <BasicText
                    style={{ fontSize: 14, fontFamily: "Poppins-Bold" }}
                  >
                    {offering.product.currencyCode}
                  </BasicText>
                </BasicText>
                <BasicText style={styles.productLabel}>
                  {offering.packageType === "MONTHLY" ? "per month" : ""}
                </BasicText>
                <BasicText style={styles.productDescription}>
                  *{offering.product.description}
                </BasicText>
              </View>
            </View>
          </View>
        );
      });
    }
  };

  const renderAcceptTOS = () => {
    return (
      <View style={styles.tosContainer}>
        <Checkbox
          value={agreeTOS}
          onValueChange={() => setAgreeTOS(!agreeTOS)}
        />
        <View style={styles.tosLabelContainer}>
          <BasicText style={{ color: "#ffffff" }}>I agree to </BasicText>
          {Platform.OS === "ios" && (
            <TextButton
              onPress={() =>
                handlePressURL(
                  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
                )
              }
              text={"Terms of use, "}
            />
          )}
          <TextButton
            onPress={() => handlePressURL("https://www.kapaii.app/")}
            text={"Privacy policy"}
          />
        </View>
      </View>
    );
  };

  const renderPurchaseButton = () => {
    return (
      <View style={styles.purchaseBtnContainer}>
        <PrimaryButton
          disabled={!agreeTOS}
          onPress={handlePurchase}
          text={"Purchase subscription!"}
        />
      </View>
    );
  };

  const handlePurchase = async () => {
    try {
      // Grab the offering the user will purchase
      const offerings = await Purchases.getOfferings();
      let offering;
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        offering = offerings.current.availablePackages[0];
      }

      const { customerInfo } = await Purchases.purchasePackage(offering);

      if (customerInfo) {
        await saveUserSubscriptionId(customerInfo.originalAppUserId);
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert("Error", e);
      }
    }
  };

  const handlePressURL = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
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

          {renderHeroMessage()}
          {renderOfferings()}
          {renderAcceptTOS()}
          {renderPurchaseButton()}

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
  productHeader: {
    width: "100%",
    backgroundColor: "#1f30fb",
  },
  productBodyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  productTitle: {
    color: "#ffd600",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    textAlign: "center",
    padding: 20,
  },
  price: {
    color: "#1f30fb",
    fontSize: 60,
    fontFamily: "Poppins-Bold",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  priceDetails: {
    color: "#b9b9b9",
  },
  cardContainer: {
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#6e6e6e",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    margin: 40,
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
  productLabel: {
    color: "#1f30fb",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  productDescription: {
    color: "#000000",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
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
    marginTop: 20,
    alignItems: "flex-end",
  },
  purchaseBtnContainer: {
    marginLeft: 50,
    marginRight: 50,
  },
  tosContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  tosLabelContainer: {
    flexDirection: "row",
    marginLeft: 14,
  },
});
