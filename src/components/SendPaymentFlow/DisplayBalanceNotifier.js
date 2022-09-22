import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'

import { strings } from '../../../locales/i18n';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyAmount from "../CurrencyAmount";

export default function TransferCompleteNotifier(props) {

    const { navigation, balance, resetTransferData } = props;


    if (balance !== undefined) {
        var balanceDisplay = (
            <Text style={styles.balance}>
                Balance: <CurrencyAmount amount={balance / 100} />
            </Text>
        )
    } else {
        balanceDisplay = null
    }

    return (

        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <Icon name="credit-card-wireless-outline" size={100} color="#3D454C" />
                {balanceDisplay}
            </View>
            <View style={styles.chargeContainer}>
                <TouchableHighlight underlayColor='#298F91' style={styles.chargeButton}
                    onPress={() => {
                        resetTransferData();
                        navigation.navigate('Home')
                    }}
                    accessibilityLabel={strings('TransferCompleteScreen.Continue')}>
                    <Text style={styles.chargeButtonText}>{strings('TransferCompleteScreen.Continue')}</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        flex: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chargeContainer: {
        flex: 2,
        margin: 20
    },
    chargeButton: {
        padding: 10,
        backgroundColor: '#2D9EA0',
        justifyContent: 'center',
    },
    chargeButtonText: {
        color: '#FFF',
        fontSize: 24,
        textAlign: 'center'
    },
    balance: {
        color: '#3D454C',
        fontSize: 38,
        fontWeight: 'bold',
    },
});