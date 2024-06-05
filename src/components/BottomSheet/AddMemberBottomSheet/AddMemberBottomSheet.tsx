import React, { forwardRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BasicBottomSheet from "../BasicBottomSheet";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "../../Button/PrimaryButton";
import { supabase } from "../../../services/supabase";
import useProfileStore from "../../../stores/profileStore";
import { useInviteMember } from "../../../features/welcome/hooks/useInviteMember";
import { BasicBottomSheetTextInput } from "../../Input/BasicBottomSheetTextInput";
import { useForm } from "react-hook-form";
import { inviteValidation } from "./inviteValidation";
import BasicText from "../../Text/BasicText";
import useTeamStore from "../../../stores/teamStore.ts";

interface AddMemberBottomSheetProps {}

export const AddMemberBottomSheet = forwardRef(
  (props: AddMemberBottomSheetProps, ref) => {
    const {
      data: { me, subscription },
    } = useProfileStore();
    const {
      data: { myTeam },
    } = useTeamStore();
    const {
      operations: { sendInvite },
    } = useInviteMember();

    const {
      getValues,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<any>();

    const [inviteSent, setInviteSent] = useState(false);

    const handleInvite = async () => {
      if (getValues() && getValues("email")) {
        const recipientEmail = getValues("email");

        const res = await sendInvite(recipientEmail);
        if (!res) {
          setInviteSent(true);
        }
      }
    };

    const displayMemberCountStatus = () => {
      if (!subscription) return;

      // Remaining available seats
      const seats =
        subscription.metadata.seats -
        myTeam.filter((user) => user.profile_id === me.id).length;

      return (
        <BasicText style={styles.subtitle}>
          You may add{" "}
          <BasicText style={{ color: "#1f30fb", fontFamily: "Poppins-Bold" }}>
            {seats}
          </BasicText>{" "}
          more member{subscription.metadata.seats == 1 ? "" : "s"} in your team.
        </BasicText>
      );
    };

    return (
      <SafeAreaView>
        <BasicBottomSheet ref={ref} _snapPoints={["50%"]}>
          <View style={{ padding: 20 }}>
            <BasicText style={styles.addMemberMessage}>
              Invite a member!
            </BasicText>
            {displayMemberCountStatus()}
            <BasicBottomSheetTextInput
              name={"email"}
              errors={errors}
              control={control}
              rules={{ validate: inviteValidation }}
              placeholder={"Enter email"}
              inputStyle={styles.addMemberInput}
            />
            <View style={styles.addBtnContainer}>
              {inviteSent ? (
                <Text style={styles.inviteSentMsg}>Invite sent!</Text>
              ) : (
                <PrimaryButton
                  disabled={Object.keys(errors).length !== 0}
                  onPress={handleSubmit(handleInvite)}
                  text={"Invite"}
                />
              )}
            </View>
          </View>
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
  addMemberMessage: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
  addMemberInput: {
    marginTop: 20,
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#8d8d8d",
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
    backgroundColor: "#f2f4ff",
  },
  addBtnContainer: {
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
  },
  addBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1f30fb",
  },
  addBtnText: {
    marginRight: 8,
    textAlign: "center",
    fontWeight: "900",
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  inviteSentMsg: {
    fontFamily: "Poppins-Bold",
    color: "#1f30fb",
  },
  subtitle: {
    color: "grey",
    marginTop: 6,
  },
});
