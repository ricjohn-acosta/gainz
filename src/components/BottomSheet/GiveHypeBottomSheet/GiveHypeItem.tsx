import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Touchable, TouchableOpacity,
  View
} from "react-native";

import images from "../../../../assets";
import Avatar from "../../Avatar/Avatar";
import { IconButton } from "../../Button/IconButton";
import BasicText from "../../Text/BasicText";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

// TODO: userId is actually a fuckin username?? why did i do that?? change this please
interface GiveHypeItemProps {
  uid: string;
  userId: string;
  username: string;
  addHype: (id: string) => void;
  removeHype: (id: string) => void;
  writeHypeMessage: (id: string, message: string) => void;
  hypeToGive: any;
  singleUserHype: boolean;
}

export const GiveHypeItem = (props: GiveHypeItemProps) => {
  const {
    uid,
    singleUserHype,
    userId,
    username,
    hypeToGive,
    addHype,
    removeHype,
    writeHypeMessage,
  } = props;

  const navigation = useNavigation<any>();

  const [showMessage, setShowMessage] = useState<boolean>(false);

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <View style={styles.item}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                uid: uid,
              })
            }
          >
            <Avatar uid={uid} md />
          </TouchableOpacity>
          <BasicText style={styles.memberName}>{username}</BasicText>
        </View>
        <View style={styles.giveHypeControls}>
          {hypeToGive?.counter > 0 && (
            <View style={{ marginRight: 8 }}>
              <IconButton
                onPress={() => setShowMessage(!showMessage)}
                IconComponent={Entypo}
                iconProps={{
                  name: "pencil",
                  size: 18,
                  defaultColor: "black",
                  pressedColor: "grey",
                }}
              />
            </View>
          )}
          <BasicText style={styles.hypeToGiveCounter}>
            {hypeToGive?.counter ?? 0}
          </BasicText>
          <View style={styles.countAdjustor}>
            <IconButton
              onPress={() => addHype(userId)}
              IconComponent={AntDesign}
              iconProps={{
                name: "caretup",
                size: 24,
                defaultColor: "#1f30fb",
                pressedColor: "#5f6cff",
              }}
            />
            <View>
              <IconButton
                IconComponent={AntDesign}
                iconProps={{
                  name: "caretdown",
                  size: 24,
                  defaultColor: "#1f30fb",
                  pressedColor: "#5f6cff",
                }}
                onPress={() => removeHype(userId)}
              />
            </View>
          </View>
        </View>
      </View>

      {hypeToGive?.counter > 0 && showMessage && (
        <View style={styles.messageContainer}>
          <BasicText style={styles.sendMsgLabel}>
            Send {username} a message
          </BasicText>
          {singleUserHype ? (
            <TextInput
              defaultValue={hypeToGive?.message}
              onChangeText={(text) => writeHypeMessage(userId, text)}
              style={styles.messageInput}
              placeholder={`Let them know how awesome they are!`}
            />
          ) : (
            <BottomSheetTextInput
              defaultValue={hypeToGive?.message}
              onChangeText={(text) => writeHypeMessage(userId, text)}
              style={styles.messageInput}
              placeholder={`Let them know how awesome they are!`}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    backgroundColor: "#f2f4ff",
    padding: 12,
    borderRadius: 25,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  memberName: {
    fontSize: 14,
    marginLeft: 4,
  },
  giveHypeControls: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  hypeToGiveCounter: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 22,
    fontFamily: "Poppins-Bold",
  },
  messageContainer: {
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#f2f4ff",
    padding: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  messageInput: {
    marginTop: 4,
    fontFamily: "Poppins-Regular",
  },
  sendMsgLabel: {
    fontFamily: "Poppins-Bold",
  },
  countAdjustor: {
    flexDirection: "column",
    gap: 6,
  },
});
