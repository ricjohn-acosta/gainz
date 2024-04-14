import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import images from "../../../../assets";
import Avatar from "../../../components/Avatar/Avatar";
import useProfileStore from "../../../stores/profileStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddMemberBottomSheet } from "../../../components/BottomSheet/AddMemberBottomSheet/AddMemberBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMyTeam } from "../hooks/useMyTeam";
import useTeamStore from "../../../stores/teamStore";

export default function MyTeam() {
  const navigation = useNavigation<any>();
  const {
    data: { me },
  } = useProfileStore();
  const {
    data: { myTeam, meTeamData },
  } = useTeamStore();

  const getListData = () => {
    if (!myTeam || !meTeamData) return
    const filteredTeamData = myTeam.filter(user => user.profile_id  !== me.id)
    meTeamData.sortOrder = 1
    return [meTeamData, ...filteredTeamData]
  }

  if (!myTeam) return null

  return (
    <>
      <View style={styles.container}>
        <FlatList
          columnWrapperStyle={{
            marginTop: 16,
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
          }}
          scrollEnabled={false}
          horizontal={false}
          key={getListData().length}
          data={getListData()}
          numColumns={3}
          renderItem={(data: any) => {
            return (
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile", {
                    uid: data.item.profile_id
                  })}
                >
                  <Avatar
                    url={data.item.img}
                    status={data.item.status}
                    username={data.item.username}
                    md
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 10,
  },
  addMemberBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addMemberBtn: {
    width: 60,
    height: 60,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
