import {Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import GymAvatar from "../features/gym/components/GymAvatar";
import { Dimensions } from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useFonts} from "expo-font";
import GradientText from "../components/Text/GradientText";
import BottomSheet from '@gorhom/bottom-sheet';
import {useGymMultiplayer} from "../features/gym/hooks/useGymMultiplayer";
import {onValue, ref} from "firebase/database";
import {realtimeDB} from "../../firebase/clientApp";
import {useAvatarMovement} from "../features/gym/hooks/useAvatarMovement";
import firebase from "firebase/compat";
import {auth} from "../../firebase/clientApp"

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
export default function GymScreen(props) {

    let avatars;
    const playerRef = ref(realtimeDB,`players`)
    onValue(playerRef, (snapshot) => {
        avatars = snapshot.val() || {}
    })

    const {openBottomSheet} = props
    const {data:{user}, operations: {signInAsGuest}} = useGymMultiplayer()
    const [fontsLoaded] = useFonts({
        'krunchBold': require('../../assets/fonts/KrunchBold-OKn6.ttf'),
        'krunchBoldItalic': require('../../assets/fonts/KrunchBoldItalic-Zzw3.ttf'),
    });
    const [position, setPosition] = useState({locationX: 0, locationY: 0})
    const {data: {spriteAnimationRef, avatarAnimation}} = useAvatarMovement()

    useEffect(() => {
        signInAsGuest()
    }, []);

    const handlePress = (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setPosition({locationX, locationY})
    };

    if (!fontsLoaded || !avatars) return <></>

    return (
        <ImageBackground resizeMode={'cover'} source={require('../../assets/default_scene.png')} style={styles.imageBackground}>
            {/*<View style={styles.container}>*/}
            {/*    <Pressable style={styles.interactiveArea} onPress={e => {*/}
            {/*        handleAvatarMovement(e)*/}
            {/*        handlePress(e)*/}
            {/*    }}/>*/}
            {/*    /!*<Pressable style={styles.interactiveArea} onPress={handlePress}/>*!/*/}
            {/*    /!*{Object.entries(avatars).map(avatar => {*!/*/}
            {/*    /!*    avatar.*!/*/}
            {/*    /!*})}*!/*/}
            {/*    /!*{avatars && <GymAvatar position={avatars[user.uid]} openBottomSheet={openBottomSheet}/>}*!/*/}
            {/*    {avatars && Object.entries(avatars).map(avatar => {*/}
            {/*        // Avatar[0] is the uid of a user*/}
            {/*        const avatarId = avatar[0]*/}
            {/*        const position = avatar[1]*/}
            {/*        return <GymAvatar uid={avatarId} position={position} openBottomSheet={openBottomSheet} spriteAnimationRef={spriteAnimationRef} avatarAnimation={avatarAnimation}/>*/}
            {/*    })}*/}

            {/*    <View style={styles.btnContainer}>*/}
            {/*        <TouchableOpacity onPress={() => console.log('left')} style={styles.navigateBtn}>*/}
            {/*            <Image style={styles.navIcon} source={require('../../assets/left-arrow.png')}/>*/}
            {/*        </TouchableOpacity>*/}
            {/*        <TouchableOpacity style={styles.hypeBtn}>*/}
            {/*            <View style={{width: width, position: 'absolute', top: -18}}>*/}
            {/*                <GradientText style={styles.hypeText}>HYPE mookentooken</GradientText>*/}
            {/*            </View>*/}
            {/*            <Image style={styles.hypeIcon} source={require('../../assets/hype.png')}/>*/}
            {/*            <Text style={{fontFamily: 'krunchBoldItalic', marginTop: 6}}>5</Text>*/}
            {/*        </TouchableOpacity>*/}
            {/*        <TouchableOpacity style={styles.navigateBtn}>*/}
            {/*            <Image style={styles.navIcon} source={require('../../assets/right-arrow.png')}/>*/}
            {/*        </TouchableOpacity>*/}
            {/*    </View>*/}
            {/*</View>*/}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        height: height,
    },
    container: {
        width: width,
        height: height-200,
        marginTop: 100,
        marginBottom: 500,
    },
    interactiveArea: {
        width: '100%',
        height: '100%',
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hypeBtn: {
        width: 70,
        height: 70,
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: "center",
        // shadows
        shadowColor: '#000',        // iOS
        shadowOffset: { width: 0, height: 2 },  // iOS
        shadowOpacity: 0.3,         // iOS
        shadowRadius: 2,            // iOS
        elevation: 1,               // Android
    },
    hypeIcon: {
        width: 40,
        height: 40
    },
    hypeText: {
        fontFamily: 'krunchBold',
        fontSize: 16,
        textAlign: 'center'
    },
    navigateBtn: {
        width: 30,
        height: 30,
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: "center",
        // shadows
        shadowColor: '#000',        // iOS
        shadowOffset: { width: 0, height: 2 },  // iOS
        shadowOpacity: 0.3,         // iOS
        shadowRadius: 2,            // iOS
        elevation: 1,               // Android
    },
    navIcon: {
        width: 20,
        height: 20,
    }
});