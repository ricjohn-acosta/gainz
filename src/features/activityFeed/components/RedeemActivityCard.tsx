import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import BasicText from "../../../components/Text/BasicText";
import Avatar from "../../../components/Avatar/Avatar.tsx";
import moment from "moment";
import LottieView from "lottie-react-native";
import images from "../../../../assets/index.ts";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

interface RedeemActivityCardProps {
  datePosted: string;
  redeemerId: string;
  redeemerUsername: string;
  rewardName: string;
  amount: number;
}

export const RedeemActivityCard = (props: RedeemActivityCardProps) => {
  const { redeemerUsername, redeemerId, rewardName, amount, datePosted } =
    props;

  const redeemAnimationRef = useRef<LottieView>(null);

  useEffect(() => {
    redeemAnimationRef.current.play();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.postInfoContainer}>
        <View style={styles.postAvatar}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                uid: redeemerId,
              })
            }
          >
            <Avatar uid={redeemerId} md />
          </TouchableOpacity>
        </View>
        <View style={styles.postDetails}>
          <BasicText style={styles.displayName}>
            {redeemerUsername}{" "}
            <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>
              redeemed
            </BasicText>{" "}
            a reward!
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

      <View style={styles.animationContainer}>
        <LottieView
          resizeMode={"contain"}
          style={{ width: 300, height: 200 }}
          source={images.redeemAnimation}
          ref={redeemAnimationRef}
          loop
          autoPlay={false}
        />

        <View style={styles.postContentContainer}>
          <BasicText style={{ color: "grey" }}>
            {redeemerUsername} redeemed
          </BasicText>
          <View style={styles.hypeReceivedContainer}>
            <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>
              {rewardName}
            </BasicText>
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
    // <View style={styles.container}>
    //   <Entypo
    //     style={{ marginRight: 10 }}
    //     name="megaphone"
    //     size={25}
    //     color={"#9b8722"}
    //   />
    //   <BasicText style={{fontSize: 12}}>
    //     <BasicText style={{ color: "#c5a70a", fontFamily: "Poppins-Bold" }}>
    //       {redeemerUsername}
    //     </BasicText>
    //     <BasicText style={{ color: "#c5a70a" }}> redeemed </BasicText>
    //     <BasicText style={{ color: "#c5a70a", fontFamily: "Poppins-Bold" }}>
    //       {rewardName}!
    //     </BasicText>
    //   </BasicText>
    // </View>
  );
};

export default RedeemActivityCard;

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
    marginBottom: 20,
  },
  animationContainer: {
    backgroundColor: "#fffcdc",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
