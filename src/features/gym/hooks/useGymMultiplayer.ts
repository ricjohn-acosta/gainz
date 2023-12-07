import { signInAnonymously, onAuthStateChanged} from "firebase/auth";
import { ref, set, onDisconnect, onValue, update} from "firebase/database";
import { auth, realtimeDB } from "../../../../firebase/clientApp"
import {useEffect, useState} from "react";

export const useGymMultiplayer = () => {

    const [avatars, setAvatars] = useState({})
    const [user, setUser] = useState(null)
    const [userRef, setUserRef] = useState(null)

    const startMultiplayer = () => {
        const playerRef = ref(realtimeDB,`players`);
        onValue(playerRef, (snapshot) => {
            setAvatars(snapshot.val() || {})
        })
    }

    const authListener = (authUser) => {
        if (authUser) {
            const playerId = authUser.uid;
            const userRef = ref(realtimeDB,`players/${playerId}`);
            setUser(authUser)
            setUserRef(userRef)
            set(userRef,{
                id: playerId,
                name: 'test-player',
                direction: "right",
                color: 'blue',
                locationX:0,
                locationY:0,
            })
            onDisconnect(userRef).remove()
            startMultiplayer()
        } else {
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, authListener)
    }, [auth])

    const signInAsGuest = () => {
        return signInAnonymously(auth).then(res => console.log(res)).catch(e => console.log('error', e))
    }

    const handleAvatarMovement = (event) => {
        const { locationX, locationY } = event.nativeEvent;
        update(userRef,{
            locationX,
            locationY,
            isMoving: true
        })
    }

    return {
        data: {
            user,
            avatars
        },
        operations: {
            signInAsGuest,
            handleAvatarMovement
        }
    }
}