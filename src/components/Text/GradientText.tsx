import React from 'react';
import {Text, View} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import MaskedView from '@react-native-masked-view/masked-view';

const GradientText = props => {
    return (
        <View>
            <View>
                <MaskedView maskElement={<Text {...props} />}>
                    <LinearGradient
                        colors={['#ff0000', '#bd3b08', '#070000']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}>
                        <Text {...props} style={[props.style, {opacity: 0}]} />
                    </LinearGradient>
                </MaskedView>
            </View>
        </View>

    );
};

export default GradientText;