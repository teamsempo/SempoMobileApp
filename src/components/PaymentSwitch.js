'use strict';
import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
} from 'react-native';

import { connect } from "react-redux";

import SendPaymentCameraScreen from './SendPaymentFlow/SendPaymentCameraScreen';
import CheckCardBalanceScreen from './SendPaymentFlow/CheckCardBalanceScreen';
import PaymentAmountScreen from "./SendPaymentFlow/PaymentAmountScreen.js"
import PaymentsAmountScreen from "../components/ReceivePaymentFlow/PaymentsAmountScreen";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        transferData: state.creditTransfers.transferData,
    };
};

class PaymentSwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static defaultProps = {
        camera: false,
        send: false,
        charge: false,
        balance: false
    };

    render() {
        const { transferData } = this.props;
        console.log('payment switch--', transferData.default_transfer_mode);

        if (transferData.default_transfer_mode === 'camera' && transferData.temp_transfer_mode === null) {
            return <SendPaymentCameraScreen navigation={this.props.navigation} />
        } else if (transferData.default_transfer_mode === 'send' || transferData.temp_transfer_mode === 'send') {
            return <PaymentAmountScreen navigation={this.props.navigation} />
        } else if (transferData.default_transfer_mode === 'charge') {
            return <PaymentsAmountScreen navigation={this.props.navigation} />
        } else if (transferData.default_transfer_mode == 'balance') {
            return <CheckCardBalanceScreen navigation={this.props.navigation} />
        } else if (this.props.login.isVendor) {
            return <PaymentsAmountScreen navigation={this.props.navigation} />
        } else {
            return <SendPaymentCameraScreen navigation={this.props.navigation} />
        }
    }
}
export default connect(mapStateToProps, null)(PaymentSwitch);

const styles = StyleSheet.create({
    rootContainer: {
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#FFF',
        flex: 5,
        // width: Dimensions.get('window').width * 0.3,
        display: 'flex',
        flexDirection: 'row',
        height: '30%',
    }
});