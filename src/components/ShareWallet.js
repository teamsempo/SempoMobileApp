import React from 'react';
import {
    View,
    TouchableNativeFeedback,
    Share,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from "../../locales/i18n";



export default function ShareWallet({ transferAccount, color }) {
    const onShare = async () => {
        const walletAddress = transferAccount && transferAccount.blockchain_address;
        try {
            const result = await Share.share({
                message: 'ethereum:'+walletAddress,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={() => onShare()}
            accessibilityLabel={strings('ShareWallet.Label')}
            accessibilityHint={strings('ShareWallet.Hint')}
        >
            <View style={{flex: 1, display: 'flex',justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Icon name={'share-variant'} size={30} color={color? color: '#000'}
                      backgroundColor="#2D9EA0"
                />
            </View>
        </TouchableNativeFeedback>
    )
}