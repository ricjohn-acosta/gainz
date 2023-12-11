import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Animated, Easing, View, Text, Pressable, TouchableOpacity} from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';
import {onValue, ref, update} from "firebase/database";
import {realtimeDB} from "../../../../firebase/clientApp";
import {useAvatarMovement} from "../hooks/useAvatarMovement";


const GymAvatar = (props) => {

    const {openBottomSheet, position, uid} = props
    const [animation] = useState<any>(new Animated.ValueXY({ x: position.locationX, y: position.locationY }));
    const [idleTimerStart, setIdleTimerStart] = useState<boolean>(false)
    const [idle, setIdle] = useState<boolean>(false)
    const mummyRef = useRef();

    // Move square on press
    useEffect(() => {
        if (!position) return
        moveSquare()
    }, [position]);

    // Move square randomly on idle after 15 seconds - then move randomly every 5 seconds
    // useEffect(() => {
    //     if (!idle) return
    //     const intervalId = setInterval(() => {
    //         moveSquareWhenIdle()
    //     }, 5000);
    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [idle]);

    useEffect(() => {
        if (!idleTimerStart) return
        const timeoutId = setTimeout(() => {
            setIdle(true)
        }, 10000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [idleTimerStart]);

    const moveSquare = () => {
        // if (!position.isMoving) return
        if (!position) return
        // if (position.isMoving) {
        //     mummyRef.current.play({type: 'walk', fps: 16, loop: true })
        // }
        // @ts-ignore
        mummyRef.current.play({type: 'walk', fps: 16, loop: true })

        setIdle(false)
        setIdleTimerStart(false)
        Animated.timing(animation, {
            toValue: { x: position.locationX - 100/2, y: position.locationY - 100/2 },
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start((animation) => {
            if (animation.finished) {
                // const userRef = ref(realtimeDB,`players/${position.id}`);
                // update(userRef,{
                //     isMoving: false,
                // })
                // setIdleTimerStart(true)
                // // @ts-ignore
                // mummyRef.current.stop()
            }
        })
    };

    // const moveSquareWhenIdle = () => {
    //     if (!idle) return
    //     // @ts-ignore
    //     mummyRef.current.play({type: 'walk', fps: 16, loop: true })
    //     const randomX = Math.floor(Math.random() * (80 - 50 + 1) + 50)
    //     const randomY = Math.floor(Math.random() * (80 - 50 + 1) + 50)
    //
    //     Animated.timing(animation, {
    //         toValue: { x: position.locationX + randomX, y: position.locationY - 100/2},
    //         duration: 2000,
    //         easing: Easing.linear,
    //         useNativeDriver: false,
    //     }).start(animation => {
    //         if (animation.finished) {
    //             // @ts-ignore
    //             mummyRef.current.stop()
    //         }
    //     })
    // };

    if (!animation || !position) return <></>
    return (
        <TouchableOpacity onPress={() => openBottomSheet()} style={styles.avatarContainer}>
            <Animated.View style={{...styles.avatarContainer, transform: [{ translateX: animation.x }, { translateY: animation.y }]}}>
                <Text style={styles.avatarName}>mookentooken</Text>
                <View style={styles.avatar}>
                    <SpriteSheet
                        ref={mummyRef}
                        source={require('../../../../assets/mummy.png')}
                        columns={9}
                        rows={6}
                        height={50} // set either, none, but not both
                        width={50}
                        imageStyle={{ marginTop: -1 }}
                        animations={{
                            walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                            appear: Array.from({ length: 15 }, (v, i) => i + 18),
                            die: Array.from({ length: 21 }, (v, i) => i + 33)
                        }}
                    />
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        position: 'absolute',
        width: 100
    },
    avatar: {
      width: 50,
      height: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center',
      position: 'absolute',
      top: 25,
      left: 25,
    },
    avatarName: {
      fontFamily: 'krunchBold',
      textAlign: 'center',
      fontSize: 12,
    }

});

export default GymAvatar;



