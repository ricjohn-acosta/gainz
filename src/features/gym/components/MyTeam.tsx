import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";

import Avatar from "../../../components/Avatar/Avatar";
import useProfileStore from "../../../stores/profileStore";
import useTeamStore from "../../../stores/teamStore";
import { useCallback, useState } from "react";

export default function MyTeam() {
  const navigation = useNavigation<any>();
  const {
    data: { me },
    operations: { getMeProfile },
  } = useProfileStore();
  const {
    data: { myTeam, meTeamData },
    operations: { getMyTeam },
  } = useTeamStore();

  const [teamData, setTeamData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getMeProfile().then((error) => {
        if (error) return;
        getMyTeam();
      });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      getListData();
    }, [myTeam, meTeamData]),
  );

  const getListData = () => {
    if (!myTeam || !meTeamData) {
      setTeamData([]);
      return;
    }

    const filteredTeamData = myTeam.filter((user) => user.profile_id !== me.id);
    meTeamData.sortOrder = 1;

    if (myTeam.length > 1) {
      // only show if there are other members in the team apart from the team owner
      setTeamData([...filteredTeamData]);
    } else {
      setTeamData([]);
    }
  };

  const renderTeamList = useCallback(
    (data) => {
      if (me.id === data.item.profile_id) return null;
      return (
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                uid: data.item.profile_id,
              })
            }
          >
            <Avatar
              teamList
              uid={data.item.profile_id}
              status={data.item.status}
              username={data.item.username}
              md
            />
          </TouchableOpacity>
        </View>
      );
    },
    [myTeam, meTeamData],
  );

  if (!myTeam) return null;

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
          key={teamData.length}
          data={teamData}
          numColumns={4}
          renderItem={renderTeamList}
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
    fontFamily: "Poppins-Bold",
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
  youIndicator: {
    position: "absolute",
    left: 18,
    top: -22,
    color: "grey",
    textAlign: "center",
    fontSize: 16,
  },
});
