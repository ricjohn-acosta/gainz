import React from 'react';
import {StyleSheet, View, Image, Text, Button, Pressable, Dimensions} from "react-native";
import BasicText from "../../../components/Text/BasicText";

const height = Dimensions.get('screen').height

const GymAvatarDetails = () => {

    const renderGrid = () => {
        const squares = Array(30).fill(0)

        return (
            <View style={styles.fitnessGridContainer}>
                {squares.map((day, index) => {
                    const randomNumber = Math.round(Math.random())

                    return <View style={randomNumber === 0 ? styles.isLazy : styles.isNotLazy}>
                        <BasicText style={{fontFamily: 'krunchBold', color: 'white', padding: 4, fontSize: 12}}>{index + 1}</BasicText>
                    </View>
                })}
            </View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.playerNameContainer}>
                <BasicText style={styles.playerName}>MOOKENTOOKEN</BasicText>
                <BasicText style={styles.playerTitle}>{'<'}neophyte{'>'}</BasicText>
            </View>
            <View style={styles.playerAvatarContainer}>
                <Image source={require('../../../../assets/placeholder_avatar.png')}/>
            </View>
            <View style={styles.playerStatsContainer}>
                <View style={styles.playerStatContainer}>
                    <BasicText style={styles.playerStatNumber}>1,002</BasicText>
                    <BasicText style={styles.playerStatLabel}>Hype received</BasicText>
                </View>
                <View style={styles.playerStatContainer}>
                    <BasicText style={styles.playerStatNumber}>2,231</BasicText>
                    <BasicText style={styles.playerStatLabel}>Hype given</BasicText>
                </View>
                <View style={styles.playerStatContainerEnd}>
                    <BasicText style={styles.playerStatNumber}>32h</BasicText>
                    <BasicText style={styles.playerStatLabel}>Workout time</BasicText>
                </View>
            </View>
            <View style={styles.fitnessTrackerContainer}>
                <BasicText style={styles.fitnessTrackerHeader}>Fitness tracker</BasicText>
                <BasicText style={styles.fitnessTrackerSubHeader}>March</BasicText>
                {renderGrid()}
            </View>
            <Pressable style={styles.hypeBtn}><BasicText style={styles.hypeBtnText}>Hype up mookentooken!</BasicText></Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        margin: 12,
        height: height
    },
    playerNameContainer: {
        marginTop: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerName: {
        fontSize: 24,
        marginBottom: 8
    },
    playerTitle: {
        fontSize: 14
    },
    playerAvatarContainer: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerStatsContainer: {
        width: '100%',
        backgroundColor: 'black',
        borderRadius: 14,
        padding: 8,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // shadows
        shadowColor: '#000',        // iOS
        shadowOffset: { width: 0, height: 2 },  // iOS
        shadowOpacity: 0.3,         // iOS
        shadowRadius: 2,            // iOS
        elevation: 1,               // Android
    },
    playerStatContainer: {
        backgroundColor: 'black',
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#4f4f4f',
        padding: 4
    },
    playerStatContainerEnd: {
        backgroundColor: 'black',
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4
    },
    playerStatNumber: {
        fontSize: 20,
        color: 'white',
        marginBottom: 8
    },
    playerStatLabel: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
    },
    fitnessTrackerContainer: {
        marginTop: 40,
    },
    fitnessTrackerHeader: {
        fontSize: 20,
    },
    fitnessTrackerSubHeader: {
        fontSize: 14,
        marginTop: 8,
    },
    fitnessGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    isLazy: {
        backgroundColor: '#000',
        width: 44,
        height: 44,
        margin: 2,
        borderRadius: 4
    },
    isNotLazy: {
        backgroundColor: '#b7b6b6',
        width: 44,
        height: 44,
        margin: 2,
        borderRadius: 4
    },
    hypeBtn: {
        width: '100%',
        backgroundColor: '#e04040',
        padding: 16,
        borderRadius: 14,
        // marginTop: 20,
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
        // shadows
        shadowColor: '#000',        // iOS
        shadowOffset: { width: 0, height: 2 },  // iOS
        shadowOpacity: 0.3,         // iOS
        shadowRadius: 2,            // iOS
        elevation: 1,               // Android
    },
    hypeBtnText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'krunchBoldItalic',
    }
})
export default GymAvatarDetails;