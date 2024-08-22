import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import BasicText from "../../../components/Text/BasicText";
import Divider from "../../../components/Divider/Divider.tsx";
import Avatar from "../../../components/Avatar/Avatar.tsx";
import moment from "moment/moment";
import LottieView from "lottie-react-native";
import images from "../../../../assets/index.ts";

interface HypeActivityCardProps {
  senderUsername: string;
  senderId: string;
  recipientUsername: string;
  recipientId: string;
  hypeReceived: number;
  hypeMessage: string;
  datePosted: string;
}

export const HypeActivityCard = (props: HypeActivityCardProps) => {
  const {
    senderUsername,
    recipientUsername,
    hypeReceived,
    hypeMessage,
    recipientId,
    senderId,
    datePosted,
  } = props;

  const celebrationAnimationRef = useRef<LottieView>(null);

  useEffect(() => {
    celebrationAnimationRef.current.play();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.postInfoContainer}>
        <View style={styles.postAvatar}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                uid: senderId,
              })
            }
          >
            <Avatar uid={senderId} md />
          </TouchableOpacity>
        </View>
        <View style={styles.postDetails}>
          <BasicText style={styles.displayName}>
            {senderUsername}{" "}
            <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>
              hyped
            </BasicText>{" "}
            {recipientUsername}!
          </BasicText>
          <BasicText style={styles.datePosted}>
            {moment(datePosted).format("D MMM")}
          </BasicText>
        </View>
        {/*<View style={styles.likeBtn}>*/}
        {/*  {!liked ? (*/}
        {/*    <TouchableOpacity*/}
        {/*      hitSlop={8}*/}
        {/*      onPress={() => {*/}
        {/*        setLiked(true);*/}
        {/*        like(postId, "post");*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <Ionicons name={"heart-outline"} size={18} color={"#000000"} />*/}
        {/*    </TouchableOpacity>*/}
        {/*  ) : (*/}
        {/*    <TouchableOpacity*/}
        {/*      onPress={() => {*/}
        {/*        setLiked(false);*/}
        {/*        unlike(postId, "post");*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <Ionicons name={"heart-sharp"} size={18} color={"#ff0074"} />*/}
        {/*    </TouchableOpacity>*/}
        {/*  )}*/}
        {/*  <View style={styles.likeBtn}>*/}
        {/*    <BasicText>{likes.length}</BasicText>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>

      {hypeMessage && (
        <View style={styles.postMessageContainer}>
          <BasicText style={{ textAlign: "center" }}>{hypeMessage}</BasicText>
        </View>
      )}

      <View style={styles.animationContainer}>
        <LottieView
          resizeMode={"contain"}
          style={{ width: 300, height: 200 }}
          source={images.celebrationAnimation}
          ref={celebrationAnimationRef}
          loop
          autoPlay={false}
        />

        <View style={styles.postContentContainer}>
          <BasicText style={{color: "grey" }}>
            {recipientUsername} received
          </BasicText>
          <View style={styles.hypeReceivedContainer}>
            <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>
              {hypeReceived}
            </BasicText>
            <MaterialIcons
              name="local-fire-department"
              size={16}
              color={"#ff046d"}
            />
          </View>
        </View>
      </View>
      {/*<View style={styles.announcementContainer}>*/}
      {/*  <Entypo*/}
      {/*    style={{ marginRight: 10 }}*/}
      {/*    name="megaphone"*/}
      {/*    size={25}*/}
      {/*    color={"#be4b4b"}*/}
      {/*  />*/}
      {/*  <BasicText style={{ fontSize: 12 }}>*/}
      {/*    <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>*/}
      {/*      {senderUsername}*/}
      {/*    </BasicText>*/}
      {/*    <BasicText style={{ color: "#ff046d" }}> hyped </BasicText>*/}
      {/*    <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>*/}
      {/*      {recipientUsername}!*/}
      {/*    </BasicText>*/}
      {/*  </BasicText>*/}
      {/*  <View style={styles.hypeReceivedContainer}>*/}
      {/*    <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>*/}
      {/*      {" "}*/}
      {/*      {hypeReceived}*/}
      {/*    </BasicText>*/}
      {/*    <MaterialIcons*/}
      {/*      name="local-fire-department"*/}
      {/*      size={16}*/}
      {/*      color={"#ff046d"}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*</View>*/}

      {/*{hypeMessage && (*/}
      {/*  <View style={styles.messageContainer}>*/}
      {/*    <Divider*/}
      {/*      dividerStyle={{*/}
      {/*        backgroundColor: "red",*/}
      {/*        marginLeft: 14,*/}
      {/*        marginRight: 14,*/}
      {/*        marginTop: 4,*/}
      {/*        marginBottom: 4,*/}
      {/*        height: 0.3,*/}
      {/*      }}*/}
      {/*    />*/}
      {/*    <BasicText*/}
      {/*      style={{*/}
      {/*        color:"#ff046d",*/}
      {/*        fontSize: 14,*/}
      {/*        textAlign: "center",*/}
      {/*        paddingTop: 2,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      "{hypeMessage}"*/}
      {/*    </BasicText>*/}
      {/*  </View>*/}
      {/*)}*/}
    </View>
  );
};

export default HypeActivityCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  hypeReceivedContainer: {
    marginLeft: 4,
    alignItems: "center",
    flexDirection: "row",
  },
  announcementContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  messageContainer: {
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  postInfoContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  postAvatar: {},
  postDetails: {
    flex: 1,
    paddingTop: 8,
  },
  likeBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  displayName: {
    fontFamily: "Poppins-Bold",
    color: "#000000",
    marginLeft: 4,
  },
  datePosted: {
    color: "grey",
    fontSize: 12,
    marginLeft: 4,
  },
  postContentContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  postMessageContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  animationContainer: {
    backgroundColor: "#d7e9f9",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
