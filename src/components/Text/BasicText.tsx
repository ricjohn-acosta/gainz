import React from 'react';
import {Text, View} from "react-native";
import {useFonts} from "expo-font";

const BasicText = (props) => {
    const { style } = props
    const [fontsLoaded] = useFonts({
        'krunchBold': require('../../../assets/fonts/KrunchBold-OKn6.ttf'),
        'krunchBoldItalic': require('../../../assets/fonts/KrunchBoldItalic-Zzw3.ttf'),
    });

    if (!fontsLoaded) return <></>

    return (
        <Text style={{...style, fontFamily: style.fontFamily ?? 'krunchBold'}}>
            {props.children}
        </Text>
    );
};

export default BasicText;