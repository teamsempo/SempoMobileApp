import React from 'react';
import {
    View,
    TouchableNativeFeedback
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from "../../locales/i18n";



export default function ExitToHome({ navigation, color }) {
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={() => navigation.navigate('Home')}
            accessibilityLabel={strings('SendPaymentCameraScreen.Close')}
        >
            <View style={{flex: 1, display: 'flex',justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Icon name={'window-close'} size={40} color={color? color: '#000'}
                      backgroundColor="#2D9EA0"
                />
            </View>
        </TouchableNativeFeedback>
    )
}