'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from "react-redux";
import { updateTransferData } from "../reducers/creditTransferReducer";
import {strings} from "../../locales/i18n";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        transferData: state.creditTransfers.transferData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
    }
};

class PaymentModeSwitcher extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static defaultProps = {
        camera: false,
        send: false,
        balance: false,
        charge: false,
        dark: false,
    };

    render() {

        let paymentOptions = [
            {mode: 'camera', name: 'qrcode-scan', active: this.props.camera, transform: [], label: strings('SendPaymentCameraScreen.CameraPrompt'), hint: strings('PaymentModeSwitcher.ScanHint')},
            {mode: 'balance', name: 'cellphone-nfc', active: this.props.balance, transform: [], label: strings('SendPaymentCameraScreen.CardBalance'), hint: strings('PaymentModeSwitcher.BalanceHint')},
            {mode: 'send', name: 'send', active: this.props.send, transform: [{rotate: '-45deg'}], label: strings('SendPaymentCameraScreen.Send'), hint: strings('PaymentModeSwitcher.SendHint')},
        ];

        if (this.props.login.isVendor || this.props.login.isSupervendor) {
            paymentOptions.push({mode: 'charge', name: 'credit-card-multiple', active: this.props.charge, transform: [], label: strings('NavBar.chargeButtonText'), hint: strings('PaymentModeSwitcher.ChargeHint')})
        }
        
        return (
            <View style={[styles.rootContainer, {borderColor: (this.props.dark ? '#000' : '#FFF')}]}>
                {paymentOptions.map((option, index) => {
                    return(
                        <TouchableNativeFeedback key={index} accessibilityLabel={option.label} accessibilityHint={option.hint} background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props.updateTransferData({default_transfer_mode: option.mode, temp_transfer_mode: null})}>
                            <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', paddingHorizontal: 10, backgroundColor: (option.active ? this.props.dark ? '#000' : '#FFF' : null)}}>
                                <View style={{transform: option.transform}}>
                                    <Icon name={option.name} size={20} color={(option.active ? this.props.dark ? '#FFF' : '#000' : this.props.dark ? '#000' : '#FFF')}
                                          backgroundColor="#2D9EA0"
                                    />
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    )
                })}
            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentModeSwitcher);

const styles = StyleSheet.create({
    rootContainer: {
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 2,
        flex: 5,
        // width: Dimensions.get('window').width * 0.3,
        display: 'flex',
        flexDirection: 'row',
        height: '30%',
    }
});