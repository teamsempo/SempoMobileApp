import React from 'react'
import {StyleSheet, Text, View, Image, Linking, TouchableNativeFeedback, Dimensions} from 'react-native'
import {connect} from "react-redux";

import {isRTL, strings} from '../../../locales/i18n';

import Styles from '../../Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PaymentsKeypad from '../PaymentsKeypad'

import { updateTransferData } from "../../reducers/creditTransferReducer.js"
import PaymentModeSwitcher from "../PaymentModeSwitcher";
import ExitToHome from "../ExitToHome"
import {removeNFCCardError} from "../../reducers/creditTransferReducer";
import ShareWallet from "../ShareWallet";

const mapStateToProps = (state) => {
    return {
        NFCCheck: state.NFCCheck,
        NFCTransfer: state.NFCTransfer,
        transferData: state.creditTransfers.transferData,
        login: state.login,
        transferAccounts: state.transferAccounts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
        removeNFCCardError: () => dispatch(removeNFCCardError())
    };
};


class PaymentsAmountScreen extends React.Component {

    handle_keypad_change(amount) {
        let key = this.makeKey();
        console.log('new key:', key)

        this.props.updateTransferData({
            transfer_amount: parseInt(amount),
            transfer_random_key: key,
        });

        this.props.removeNFCCardError()

    }

    componentWillUnmount() {
        this.props.updateTransferData({transfer_amount: null})
    }

    makeKey() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < 4; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));


        return text;
    }

    nextPaymentScreen() {
        if (this.props.transferData.transfer_amount <= 0) {
            return
        } else if (this.props.login.transferUsages.length === 0) {
            this.props.navigation.navigate('PaymentOption', { title: strings('GoBackNav.DefaultTitleText')} )
        } else {
            this.props.navigation.navigate('PaymentUse', { title: strings('GoBackNav.DefaultTitleText')} )
        }
    };

    openRefund() {
        if (this.props.transferData.transfer_amount > 0) {
            this.props.navigation.navigate('Camera', { title: strings('GoBackNav.DefaultTitleText')} )
        } else {
            return
        }
    };


    render() {
        const transferAccount = this.props.login.transferAccountId && this.props.transferAccounts.byId[this.props.login.transferAccountId];
        const displayDecimals = this.props.login.displayDecimals;
        const transferAmount = (this.props.transferData.transfer_amount);
        const isCharging = !this.props.transferData.is_sending;
        const transferDirection = isCharging? 'charge':'refund';

        return (
            <View style={Styles.rootContainer}>

                <View style={[{ flex: .15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#FFF' }]} >

                    <ExitToHome navigation={this.props.navigation} color='#000'/>

                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 3, height: '100%'}}>
                        <PaymentModeSwitcher charge={true} dark={true} />
                    </View>

                    <ShareWallet transferAccount={transferAccount} color='#000'/>

                </View>

                <PaymentsKeypad navigation={this.props.navigation}/>

                {/*<BottomAsyncButton buttonText={strings('NavBar.chargeButtonText').toUpperCase()} buttonColor={(transferDirection === 'charge' ? null : '#FBADA1')} onPress={(transferDirection === 'charge' ? () => this.openPaymentOptions() : () => this.openRefund())} />*/}

            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsAmountScreen);
