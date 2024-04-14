import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
  Text,
} from "react-native";
import images from "../../../assets";

export type UserStatus = "offline" | "online" | "in-gym";

interface AvatarProps {
  username?: string;
  url?: ImageSourcePropType;
  status?: UserStatus;
  lg?: boolean;
  md?: boolean;
  sm?: boolean;
}

export default function Avatar(props: AvatarProps) {
  const { url, status, lg, md, sm, username } = props;
  const isOnline = status === "online" || status === "in-gym";

  const displayTruncatedUsername = () => {
    if (!username) return;

    const maxLength = 6;

    if (username.length > maxLength) {
      return username.slice(0, maxLength) + "..";
    } else {
      return username;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[lg && styles.lg, sm && styles.sm, md && styles.md]}>
        <ImageBackground
          style={[
            styles.avatar,
            isOnline ? styles.onlineBorder : styles.offlineBorder,
          ]}
          source={url ?? images.defaultUser}
        />
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
          <Text style={styles.displayName}>{displayTruncatedUsername()}</Text>
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
});
