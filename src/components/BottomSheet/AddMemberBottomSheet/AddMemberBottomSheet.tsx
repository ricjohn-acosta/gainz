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

interface AddMemberBottomSheetProps {}

export const AddMemberBottomSheet = forwardRef(
  (props: AddMemberBottomSheetProps, ref) => {
    const {
      data: { me },
    } = useProfileStore();
    const {
      operations: { sendInvite },
    } = useInviteMember();
    const {
      getValues,
      control,
      handleSubmit,
      clearErrors,
      formState: { errors },
    } = useForm<any>();

    const [inviteSent, setInviteSent] = useState(false);
    const [index, setIndex] = useState(null);

    // Detect if we've closed the bottom sheet
    useEffect(() => {
      if (!index) return;
      if (index === -1) {
        setInviteSent(false);
        clearErrors();
      }
    }, [index]);

    const handleOnChange = (index) => {
      setIndex(index);
    };

    const handleInvite = async () => {
      if (getValues() && getValues("email")) {
        const recipientEmail = getValues("email");

        const res = await sendInvite(recipientEmail);
        if (!res) {
          setInviteSent(true);
        }
      }
    };

    return (
      <SafeAreaView>
        <BasicBottomSheet
          handleOnChange={handleOnChange}
          ref={ref}
          _snapPoints={["30%"]}
        >
          <View style={{ padding: 20 }}>
            <Text style={styles.addMemberMessage}>Invite a member!</Text>
            <BasicBottomSheetTextInput
              name={"email"}
              errors={errors}
              control={control}
              rules={{ validate: inviteValidation }}
              placeholder={"Enter their email"}
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
    fontWeight: "900",
  },
  addMemberInput: {
    marginTop: 20,
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#8d8d8d",
    fontSize: 16,
    lineHeight: 20,
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
    color: "white",
  },
  inviteSentMsg: {
    fontWeight: "bold",
    color: "#1f30fb",
  },
});
