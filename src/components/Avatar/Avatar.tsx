import {
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import BasicText from "../Text/BasicText";
import useTeamStore from "../../stores/teamStore.ts";
import useProfileStore from "../../stores/profileStore.ts";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { CameraOrAlbumBottomsheet } from "../../features/uploadImage/components/CameraOrAlbumBottomsheet.tsx";

export type UserStatus = "offline" | "online" | "in-gym";

interface AvatarProps {
  uid?: string;
  username?: string;
  status?: UserStatus;
  lg?: boolean;
  md?: boolean;
  sm?: boolean;
  teamList?: boolean;
  canUpdateAvatar?: boolean;
}

export default function Avatar(props: AvatarProps) {
  const { status, lg, md, sm, username, uid, teamList, canUpdateAvatar } =
    props;

  const {
    data: { me },
  } = useProfileStore();
  const {
    operations: { getMember },
    data: { myTeam },
  } = useTeamStore();

  const [changeAvatar, setChangeAvatar] = useState<boolean>(false);

  const isOnline = status === "online" || status === "in-gym";

  const getFirstLetterSize = () => {
    if (lg) {
      return 40;
    }

    if (md) {
      return 18;
    }

    if (sm) {
      return 14;
    }
  };

  const displayFirstLetterOfUsername = () => {
    if (!uid || !myTeam) return;

    if (myTeam.length === 0) {
      return me.username.charAt(0);
    }

    return getMember(uid)?.username.charAt(0);
  };

  const stringToColor = () => {
    if (!uid) return;

    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
      hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    return color;
  };

  const getUserAvatarURL = useCallback(() => {
    if (!myTeam || myTeam.length === 0) {
      return me.avatar_url ?? null;
    } else {
      return getMember(uid)?.profileData.avatar_url ?? null;
    }
  }, [me, myTeam]);

  return (
    <View style={{ ...styles.container, width: teamList ? 100 : "unset" }}>
      <View style={[lg && styles.lg, sm && styles.sm, md && styles.md]}>
        {getUserAvatarURL() ? (
          <ImageBackground
            style={[
              styles.avatar,
              isOnline ? styles.onlineBorder : styles.offlineBorder,
            ]}
            source={{ uri: getUserAvatarURL() }}
          />
        ) : (
          <View
            style={{
              ...styles.avatar,
              backgroundColor: stringToColor(),
            }}
          >
            <BasicText
              style={{ ...styles.initial, fontSize: getFirstLetterSize() }}
            >
              {displayFirstLetterOfUsername()}
            </BasicText>
          </View>
        )}
      </View>

      {canUpdateAvatar && (
        <TouchableOpacity
          onPress={() => setChangeAvatar(true)}
          style={{
            ...styles.status,
            justifyContent: "center",
            alignItems: "center",
            height: md ? 24 : 30,
            width: md ? 24 : 30,
          }}
        >
          <FontAwesome6 name="camera" size={md ? 14 : 20} color="black" />
        </TouchableOpacity>
      )}

      {/*{status && (*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      ...styles.status,*/}
      {/*      display: status === "in-gym" ? "flex" : "none",*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {status === "in-gym" && (*/}
      {/*      <Text style={{ paddingTop: 2, fontSize: 12, textAlign: "center" }}>*/}
      {/*        🏋*/}
      {/*      </Text>*/}
      {/*    )}*/}
      {/*  </View>*/}
      {/*)}*/}
      <View>
        {username && (
          <BasicText style={styles.displayName}>{username}</BasicText>
        )}
      </View>
      <CameraOrAlbumBottomsheet
        open={changeAvatar}
        onDismiss={() => setChangeAvatar(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  noAvatarUrl: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#ffffff",
    marginRight: 8,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    backgroundColor: "#f2f4ff",
    position: "absolute",
    borderRadius: 50,
    bottom: 0,
    right: 0,
  },
  displayName: {
    marginTop: 4,
    fontSize: 12,
  },
  onlineBorder: {
    borderColor: "#43d15b",
  },
  offlineBorder: {
    borderColor: "#ffffff",
  },
  sm: {
    width: 40,
    height: 40,
  },
  md: {
    width: 60,
    height: 60,
  },
  lg: {
    width: 100,
    height: 100,
  },
  initial: {
    fontSize: 16,
  },
});
