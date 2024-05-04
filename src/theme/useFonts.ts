import * as Font from "expo-font";

export const useExpoFont = async () => {
    await Font.loadAsync({
        "Poppins-Regular" : require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold" : require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "Poppins-Medium" : require("../../assets/fonts/Poppins/Poppins-Medium.ttf"),
        "Poppins-SemiBold" : require("../../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
        "Poppins-BoldItalic" : require("../../assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
        // All other fonts here
    });
};