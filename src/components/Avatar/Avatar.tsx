import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
  Text,
} from "react-native";
import images from "../../../assets";
import BasicText from "../Text/BasicText";
import useTeamStore from "../../stores/teamStore.ts";
import useProfileStore from "../../stores/profileStore.ts";

export type UserStatus = "offline" | "online" | "in-gym";

interface AvatarProps {
  uid?: string;
  username?: string;
  url?: ImageSourcePropType;
  status?: UserStatus;
  lg?: boolean;
  md?: boolean;
  sm?: boolean;
}

export default function Avatar(props: AvatarProps) {
  const { url, status, lg, md, sm, username, uid } = props;

  const {
    data: { me },
  } = useProfileStore();
  const {
    operations: { getMember },
    data: { myTeam },
  } = useTeamStore();

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
      return me.username.charAt(0).toUpperCase();
    }

    return getMember(uid)?.username.charAt(0).toUpperCase();
  };

  const stringToColor = () => {
    if (!myTeam) return
    let username;

    if (myTeam.length === 0) {
      username = me.username;
    } else {
      username = getMember(uid)?.username;
    }

    if (!username) return;

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <View style={[lg && styles.lg, sm && styles.sm, md && styles.md]}>
        {url ? (
          <ImageBackground
            style={[
              styles.avatar,
              isOnline ? styles.onlineBorder : styles.offlineBorder,
            ]}
            source={url ?? images.defaultUser}
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

      {status && (
        <View
          style={{
            ...styles.status,
            display: status === "in-gym" ? "flex" : "none",
          }}
        >
          {status === "in-gym" && (
            <Text style={{ paddingTop: 2, fontSize: 12, textAlign: "center" }}>
              🏋
            </Text>
          )}
        </View>
      )}
      <View>
        {username && (
          <BasicText style={styles.displayName}>{username}</BasicText>
        )}
      </View>
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
    height: 22,
    width: 22,
    backgroundColor: "#c0b9b9",
    position: "absolute",
    borderRadius: 50,
    borderStyle: "solid",
    borderColor: "#939393",
    borderWidth: 2,
    top: 1,
    left: -2,
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
