import React from 'react';
import {StyleSheet, View} from "react-native";
import {AddRewardForm} from "./components/AddRewardForm";

export const AddRewardScreen = () => {
    return (
        <View style={styles.container}>
            <AddRewardForm/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 12
    }
})

