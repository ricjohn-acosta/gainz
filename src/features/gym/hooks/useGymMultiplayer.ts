import { signInAnonymously, onAuthStateChanged} from "firebase/auth";
import { ref, set, onDisconnect, onValue, update} from "firebase/database";
import { auth, realtimeDB } from "../../../../firebase/clientApp"
import {useEffect, useState} from "react";

export const useGymMultiplayer = () => {

    const [avatars, setAvatars] = useState<any>(null)
    const [user, setUser] = useState(null)
    const [userRef, setUserRef] = useState(null)

    const startMultiplayer = () => {
        const uid = auth.currentUser.uid
        const playerRef = ref(realtimeDB,`players/${uid}`);
        onValue(playerRef, (snapshot: any) => {
            const avatars = snapshot.val() || {}
            setAvatars(avatars)
        })
    }

    const authListener = (authUser: any) => {
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
        return signInAnonymously(auth).then().catch(e => console.log('error', e))
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
            signInAsGuest
        }
    }
}