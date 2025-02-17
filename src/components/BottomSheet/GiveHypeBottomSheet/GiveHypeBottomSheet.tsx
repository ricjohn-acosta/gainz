import { MaterialIcons } from "@expo/vector-icons";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GiveHypeItem } from "./GiveHypeItem";
import BasicBottomSheet from "../BasicBottomSheet";
import useProfileStore from "../../../stores/profileStore";
import { supabase } from "../../../services/supabase";
import { GiveHypeSuccess } from "./GiveHypeSuccess";
import useTeamStore from "../../../stores/teamStore";
import BasicText from "../../Text/BasicText";
import { useNotifications } from "../../../services/notifications/useNotifications.ts";
import { GeneralMessage } from "../../Message/GeneralMessage.tsx";
import useSubscriptionStore from "../../../stores/subscriptionStore.ts";

interface GiveHypeBottomSheetProps {
  snapPoints?: any;
  memberUsername?: any;
}

export const GiveHypeBottomSheet = forwardRef(
  ({ snapPoints, memberUsername }: GiveHypeBottomSheetProps, ref: any) => {
    const {
      data: { me },
      operations: { getMeProfile, getUserProfileByUsername, reloadProfile },
    } = useProfileStore();
    const {
      data: { myTeam, meTeamData },
      operations: { getMyTeam },
    } = useTeamStore();
    const {
      operations: { showFeaturePaywall },
    } = useSubscriptionStore();

    const {
      operations: { sendPushNotification },
    } = useNotifications();

    const [givableHype, setGivableHype] = useState(5);
    const [hypeToGiveCounter, setHypeToGiveCounter] = useState(null);
    const [hypeTeamList, setHypeTeamList] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showSuccessView, setShowSuccessView] = useState(false);

    const givableHypeLimit = 5;

    useEffect(() => {
      if (!myTeam) return;

      const list = myTeam
        .map((item: any) => {
          return {
            uid: item.profile_id,
            id: item.username,
            username: item.username,
          };
        })
        .sort((a, b) => a.username.localeCompare(b.username));

      if (memberUsername) {
        // If giving hype to individual user through their profile
        const filteredList = list.filter(
          (item) => item.username === memberUsername,
        );
        setHypeTeamList(filteredList);
      } else {
        setHypeTeamList(list);
      }
    }, [myTeam, meTeamData]);

    useEffect(() => {
      if (meTeamData) {
        setGivableHype(meTeamData.hype_givable);
      } else {
        setGivableHype(5);
      }
    }, [meTeamData]);

    const handleAddHype = (userId: string) => {
      if (givableHype <= 0) return;

      // If user has not given anyone any hype points at all
      if (!hypeToGiveCounter) {
        setHypeToGiveCounter({ [userId]: { counter: 1, message: null } });
        setGivableHype(givableHype - 1);
        return;
      }

      // If user has already given someone hype points
      if (hypeToGiveCounter.hasOwnProperty(userId)) {
        setHypeToGiveCounter({
          ...hypeToGiveCounter,
          [userId]: {
            ...hypeToGiveCounter[userId],
            counter: hypeToGiveCounter[userId].counter + 1,
          },
        });
      } else {
        // If username doesnt exist in the object
        setHypeToGiveCounter({
          ...hypeToGiveCounter,
          [userId]: {
            ...hypeToGiveCounter[userId],
            counter: 1,
            message: null,
          },
        });
      }

      setGivableHype(givableHype - 1);
    };

    const handleRemoveHype = (userId: string) => {
      if (!hypeToGiveCounter) return;
      if (!hypeToGiveCounter[userId] || hypeToGiveCounter[userId].counter === 0)
        return;
      if (givableHype >= givableHypeLimit) return;

      setHypeToGiveCounter({
        ...hypeToGiveCounter,
        [userId]: {
          ...hypeToGiveCounter[userId],
          counter: hypeToGiveCounter[userId].counter - 1,
          message:
            hypeToGiveCounter[userId].counter === 1
              ? null
              : hypeToGiveCounter[userId].message,
        },
      });

      setGivableHype(givableHype + 1);
    };

    const handleWriteHypeMessage = (userId: string, message: string) => {
      if (!hypeToGiveCounter || !hypeToGiveCounter.hasOwnProperty(userId)) {
        return;
      }

      setHypeToGiveCounter({
        ...hypeToGiveCounter,
        [userId]: {
          ...hypeToGiveCounter[userId],
          message: message,
        },
      });
    };

    const handleSubmit = async () => {
      getMyTeam();

      if (meTeamData && meTeamData.hype_givable <= 0) {
        Alert.alert(
          "Oops!",
          "You have run out of hype points to give! Your hype points will replenish tomorrow",
        );
        return;
      }

      setSubmitLoading(true);

      if (!hypeToGiveCounter) return;

      const usernames = Object.keys(hypeToGiveCounter);
      const values = Object.values(hypeToGiveCounter);

      for (let i = 0; i < usernames.length; i++) {
        const recipientUsername = usernames[i];
        const hypeToGiveData: any = values[i];
        // Skip insert for counters equal to 0
        if (hypeToGiveData.counter === 0) continue;

        const recipientProfile =
          await getUserProfileByUsername(recipientUsername);

        // This will trigger:
        // increment_redeemable_points
        // increment_given_points
        // increment_received_points
        // decrement_givable_points
        const { error } = await supabase.from("hype_activity").insert({
          sender_id: me.id,
          sender_username: me.username,
          recipient_username: recipientUsername,
          recipient_id: recipientProfile.id,
          hype_message: hypeToGiveData.message,
          hype_points_received: hypeToGiveData.counter,
          team_id: me.team_id,
          seen: false,
        });

        sendPushNotification(recipientProfile.expo_push_token, {
          title: `${me.username} hyped you up!`,
          body: hypeToGiveData.message
            ? `${me.username}: ${hypeToGiveData.message}`
            : `You have received ${hypeToGiveData.counter} hype point${hypeToGiveData.counter > 1 ? "s" : ""} from ${me.username}`,
          extraData: {
            event: "hype_activity",
            recipient_uid: recipientProfile.id,
          },
        });

        if (error) {
          console.error(error);
          break;
        }
      }

      getMeProfile().then((error) => {
        if (error) {
          console.error(error);
          return;
        }

        reloadProfile();
        resetPoints();
        setSubmitLoading(false);
        setShowSuccessView(true);
      });
    };

    const isSubmitDisabled = () => {
      if (!hypeToGiveCounter) return true;

      const hypeToGiveCounterValues = Object.values(hypeToGiveCounter);

      return (
        hypeToGiveCounterValues.filter((item: any) => item.counter === 0)
          .length === hypeToGiveCounterValues.length
      );
    };

    const resetPoints = () => {
      setHypeToGiveCounter(null);
    };

    const renderMemberList = useCallback(
      (data) => {
        // Dont let users give themselves hype
        if (data.item.id === me.username) return null;
        return (
          <GiveHypeItem
            singleUserHype={!!memberUsername}
            uid={data.item.uid}
            userId={data.item.username}
            username={data.item.username}
            removeHype={handleRemoveHype}
            addHype={handleAddHype}
            hypeToGive={
              hypeToGiveCounter ? hypeToGiveCounter[data.item.id] : null
            }
            writeHypeMessage={handleWriteHypeMessage}
          />
        );
      },
      [handleAddHype, handleRemoveHype],
    );

    return (
      <SafeAreaView>
        <BasicBottomSheet
          onDismiss={() => {
            setShowSuccessView(false);
            setHypeToGiveCounter(null);

            if (meTeamData) {
              setGivableHype(meTeamData.hype_givable);
            }
          }}
          ref={ref}
          _snapPoints={snapPoints ?? ["95%"]}
        >
          {showSuccessView ? (
            <GiveHypeSuccess
              onClose={() => {
                ref.current.close();
                setShowSuccessView(false);
              }}
              onBack={() => setShowSuccessView(false)}
            />
          ) : (
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <BasicText style={styles.teamsTitle}>
                  {memberUsername
                    ? "Hype up " + memberUsername
                    : "Hype your team"}
                </BasicText>
                <View style={styles.hypeCounter}>
                  <BasicText style={styles.count}>{givableHype}</BasicText>
                  <MaterialIcons
                    name="local-fire-department"
                    size={22}
                    color="#ff046d"
                  />
                </View>
              </View>

              <BasicText style={styles.subtitle}>
                {memberUsername
                  ? `Send ${memberUsername} hype points!`
                  : "Choose which members to hype up!"}
              </BasicText>

              {!hypeTeamList ||
                (!memberUsername && hypeTeamList.length <= 1 && (
                  <GeneralMessage
                    title={"No team members"}
                    subtitle={"Invite members and hype them up!"}
                  />
                ))}

              <View style={styles.giveHypeItemContainer}>
                <FlatList
                  keyExtractor={(item) => item.id}
                  data={hypeTeamList}
                  renderItem={renderMemberList}
                />
              </View>

              <View style={styles.hypeBtnViewContainer}>
                {!submitLoading ? (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled()}
                  >
                    <View
                      style={{
                        ...styles.hypeBtnContainer,
                        backgroundColor: isSubmitDisabled()
                          ? "grey"
                          : "#1f30fb",
                      }}
                    >
                      <BasicText style={styles.hypeBtnText}>
                        Hype them up!
                      </BasicText>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <ActivityIndicator size={"large"} />
                )}
              </View>
            </View>
          )}
        </BasicBottomSheet>
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hypeCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  count: {
    marginTop: 2,
    fontWeight: "600",
    fontSize: 16,
  },
  teamsTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 2,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
  giveHypeItemContainer: {
    flex: 1,
    marginTop: 10,
  },
  hypeBtnContainer: {
    marginTop: 20,
    borderRadius: 25,
    padding: 14,
  },
  hypeBtnText: {
    textAlign: "center",
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  hypeBtnViewContainer: {
    marginBottom: 20,
  },
});
