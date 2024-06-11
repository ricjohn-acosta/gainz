import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useRef } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import MyStats from "./components/MyStats";
import MyTeam from "./components/MyTeam";
import useProfileStore from "../../stores/profileStore";
import { AcceptInvitation } from "../welcome/components/AcceptInvitation";
import { useMyTeam } from "./hooks/useMyTeam";
import useTeamStore from "../../stores/teamStore";
import images from "../../../assets";
import { AddMemberBottomSheet } from "../../components/BottomSheet/AddMemberBottomSheet/AddMemberBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BasicText from "../../components/Text/BasicText";
import { useNavigation } from "@react-navigation/native";
import Avatar from "../../components/Avatar/Avatar.tsx";

export default function GymScreen() {
  const {
    data: { me, subscription, loadingSubscription },
    operations: { getMeProfile, getTeamProfiles, getSubscription },
  } = useProfileStore();
  const {
    data: { myTeam },
    operations: { getMyTeam },
  } = useTeamStore();
  const {
    data: { canInvite },
  } = useMyTeam();

  const navigation = useNavigation<any>();
  const addMemberBottomSheetRef = useRef<BottomSheetModal>(null);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        getMeProfile().then((error) => {
          if (error) return;
          getTeamProfiles();
          getMyTeam();
          getSubscription();
        });
        setRefreshing(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const showAddMemberBottomSheet = () => {
    if (!subscription || !subscription.metadata) {
      navigation.navigate("SubscribeModal");
      return;
    }

    const subscriptionSeats = Number(subscription.metadata.seats);
    // Exclude team leader from team size
    const actualTeamSize = myTeam.filter(
      (user) => user.profile_id === me.id,
    ).length;

    const availableSeatCount = Math.abs(subscriptionSeats - actualTeamSize);
    if (availableSeatCount === 0) {
      navigation.navigate("SubscribeModal");
      return;
    }

    addMemberBottomSheetRef.current?.present();
  };

  const renderInviteButton = () => {
    if (loadingSubscription) return <ActivityIndicator size={"small"} />;

    return (
      canInvite && (
        <TouchableOpacity onPress={showAddMemberBottomSheet}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground style={styles.addMemberBtn} source={images.add} />
            <View style={{ marginTop: 4 }}>
              <BasicText style={{ color: "#808080" }}>Invite</BasicText>
            </View>
          </View>
        </TouchableOpacity>
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.meAvatarContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Profile", {
                  uid: me.id,
                })
              }
            >
              <Avatar uid={me.id} md />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <BasicText style={styles.subtitle}>
              Let's spread appreciation,
            </BasicText>
            <BasicText style={styles.title}>{me.username} 💪</BasicText>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
            >
              <Ionicons name="notifications" size={26} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.myStatsContainer}>
          <MyStats />
        </View>
        <View style={styles.teamsTitleContainer}>
          <BasicText style={styles.teamsTitle}>Your team</BasicText>
          <AcceptInvitation />
          {renderInviteButton()}
        </View>
        <MyTeam />
        <AddMemberBottomSheet ref={addMemberBottomSheetRef} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginLeft: 12,
    marginRight: 12,
  },
  headerContainer: {
    marginTop: 30,
    alignItems: "center",
    flexDirection: "row",
  },
  subtitle: {
    fontSize: 12,
  },
  titleContainer: {
    marginLeft: 10,
    marginTop: 10,
    flex: 1,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "black",
    fontSize: 24,
    flexGrow: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "white",
    marginRight: 8,
  },
  myStatsContainer: {
    marginTop: 20,
  },
  myTeamContainer: {
    height: "100%",
  },
  teamsTitleContainer: {
    backgroundColor: "#f2f4ff",
    paddingTop: 20,
    paddingBottom: 10,
  },
  teamsTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 6,
  },
  addMemberBtn: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  meAvatarContainer: {
    marginTop: 4,
  },
});
