import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableHighlight} from 'react-native'

import { strings } from '../../../locales/i18n';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GoBackNav from "../nav/GoBackNav";

import RequestPaymentQrCode from './RequestPaymentQrCode'
import TransferAmount from './TransferAmountDisplay'

export default class PaymentsOptionScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    render() {
        const { navigation } = this.props;

        const payment_types = [
            // {type: 'Camera', icon: 'camera', text: `${strings('PaymentsOptionScreen.QR')}`},
            {type: 'NFC', icon: 'nfc-tap', text: `${strings('PaymentsOptionScreen.NFC')}`},
            // {type: 'ManualPayment', icon: 'format-color-text', text: `${strings('PaymentsOptionScreen.Manual')}`},
        ];

        return (
            <View style={styles.rootContainer}>
                    <View style={styles.fixedContainer}>
                        <View style={styles.qrContainer}>
                            <RequestPaymentQrCode qrCodeSize={200} navigation={navigation}/>
                        </View>
                        <TransferAmount style={styles.titleContainer}/>

                        <View style={styles.promptContainer}>
                            <Text style={{marginTop: 10}}>{strings('PaymentsOptionScreen.PaymentOption')}</Text>
                        </View>
                    </View>

                    <View style={styles.paymentOptionsContainer}>
                        {
                            payment_types.map((type_dict) => (
                                <View key={type_dict.type} style={styles.paymentOption}>
                                    <Icon.Button iconStyle={{marginLeft: 10, padding: 20}} name={type_dict.icon} size={20} color="#3D454C"
                                                 backgroundColor="#FFF"
                                                 onPress={() => {
                                                     navigation.navigate(type_dict.type, { title: strings('GoBackNav.DefaultTitleText')});
                                                 }}>
                                        <Text style={{paddingLeft: 10, width: '100%'}}>{type_dict.text}</Text>
                                    </Icon.Button>
                                </View>
                            ))
                        }
                    </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    fixedContainer: {
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: 20,
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrContainer: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promptContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentOptionsContainer: {
        flex: 1,
        margin: 10,
        borderTopWidth: 1,
        borderColor: '#C2C7CC',
    },
    paymentOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#C2C7CC',
        maxHeight: 100,
    },
    inputValueText: {
        color: '#3D454C',
        fontSize: 38,
        fontWeight: 'bold',
    }
});
