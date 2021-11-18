import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Linking,
    Picker,
    Alert,
    ScrollView,
    Modal,
    Dimensions,
    TouchableOpacity,
    Image,
    TouchableNativeFeedback
} from 'react-native'

export function RadioButton(props) {
    return (
        <View style={[{
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: (props.selected ? '#2D9EA0' : '#D8D9DD'),
            alignItems: 'center',
            justifyContent: 'center',
        }, props.style]}>
            {
                props.selected ?
                    <View style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: '#2D9EA0',
                    }}/>
                    : null
            }
        </View>
    );
}