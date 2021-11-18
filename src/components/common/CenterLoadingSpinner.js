import React from 'react';
import {
    View,
    Text,
} from 'react-native'

import { ActivityIndicator } from 'react-native-paper'
import { strings } from "../../../locales/i18n";

export const CenterLoadingSpinner = (props) => {
    return (
        <View style={{flex: props.flex, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large"/>
            {props.textVisible ? <Text style={{paddingTop: 20}}>{props.loadingText ? props.loadingText : strings('ReceiptUpload.Loading')}</Text> : null}
        </View>
    )
};

CenterLoadingSpinner.defaultProps = {
    loadingText: null,
    flex: 10,
    textVisible: true,
};