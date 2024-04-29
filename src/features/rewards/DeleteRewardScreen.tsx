import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { AddRewardForm } from "./components/AddRewardForm";
import { useNavigation } from "@react-navigation/native";
import { TextButton } from "../../components/Button/TextButton";
import {DeleteRewardList} from "./components/DeleteRewardList";

export const DeleteRewardScreen = () => {

    return (
        <View style={styles.container}>
            <DeleteRewardList />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 12,
    },
});
