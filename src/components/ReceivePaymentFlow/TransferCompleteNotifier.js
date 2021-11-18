import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'

import { strings } from '../../../locales/i18n';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyAmount from "../CurrencyAmount";

export default function TransferCompleteNotifier(props) {

    const { navigation, balance, user, resetTransferData, transferData } = props;

    let firstName = (user && user.first_name) || '';
    let lastName = (user && user.last_name) || '';


    console.log('balance is:', balance);

    const isRefund = (transferData && transferData.is_sending);

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
                <Icon name="check-circle-outline" size={100} color="#3D454C"/>
                <Text style={styles.text}>{isRefund ? strings('TransferCompleteScreen.RefundSuccessMessage') : strings('TransferCompleteScreen.SuccessMessage')}</Text>
                <Text style={styles.text}>{firstName + ' ' + lastName}</Text>
                {balanceDisplay}
            </View>
            <View style={styles.chargeContainer}>
                <TouchableHighlight underlayColor='#298F91' style={styles.chargeButton}
                                    onPress={() => {
                                        console.log("resetting");
                                        resetTransferData();
                                        navigation.popToTop();
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
    text: {
        marginTop: 20,
        color: '#3D454C',
        fontSize: 14,
        fontWeight: 'bold',
    },

    balance: {
        marginTop: 20,
        color: '#3D454C',
        fontSize: 20,
        fontWeight: 'bold',
    },
});