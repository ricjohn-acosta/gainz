import {onValue, ref, update} from "firebase/database";
import {getAuth} from "firebase/auth";
import {auth, realtimeDB} from "../../../../firebase/clientApp";
import {Animated, Easing} from "react-native";
import {useEffect, useRef, useState} from "react";

export const useAvatarMovement = () => {
    const [animation] = useState<any>(new Animated.ValueXY({ x: 0, y: 0}));
    const spriteAnimationRef = useRef();
    const playerRef = ref(realtimeDB,`players`)

    let avatarPos;
    const user = auth.currentUser

    onValue(playerRef, (snapshot) => {
        if (!user) return
        avatarPos = Object.entries(snapshot.val()).find(avatar => avatar[0] === user.uid)[1]
    })

    // useEffect(() => {
    //     if (!user) return
    //     onValue(playerRef, (snapshot) => {
    //         avatarPos = Object.entries(snapshot.val()).find(avatar => avatar[0] === user.uid)[1]
    //         console.log('test', avatarPos)
    //     })
    // }, [user]);

    const handleAvatarMovement = (e) => {
        const uid = auth.currentUser.uid
        if (!uid) return
        const { locationX, locationY } = e.nativeEvent;
        const userRef = ref(realtimeDB,`players/${uid}`);
        update(userRef,{
            locationX,
            locationY,
            isMoving: true
        })

        // @ts-ignore
        spriteAnimationRef.current.play({type: 'walk', fps: 16, loop: true })

        Animated.timing(animation, {
            toValue: { x: avatarPos.locationX - 100/2, y: avatarPos.locationY - 100/2 },
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start((animation) => {
            if (animation.finished) {
                // @ts-ignore
                spriteAnimationRef.current.stop()
            }
        })
    }

    return {
        data: {
            avatarAnimation: animation,
            spriteAnimationRef: spriteAnimationRef
        },
        operations: {
        }
    }
}
