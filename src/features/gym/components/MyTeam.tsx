import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";

import Avatar from "../../../components/Avatar/Avatar";
import useProfileStore from "../../../stores/profileStore";
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
    if (!myTeam || !meTeamData) return;
    const filteredTeamData = myTeam.filter((user) => user.profile_id !== me.id);
    meTeamData.sortOrder = 1;

    if (myTeam.length > 1) {
      // only show if there are other members in the team apart from the team owner
      return [...filteredTeamData];
    } else {
      return [];
    }
  };

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
          key={getListData()?.length}
          data={getListData()}
          numColumns={3}
          renderItem={(data: any) => {
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
                    uid={data.item.profile_id}
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
