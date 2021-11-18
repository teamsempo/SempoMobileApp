import React from 'react'
import {StyleSheet, Text, View, Image, Linking, Platform, Animated, Alert, Clipboard, Vibration} from 'react-native'
import {connect} from "react-redux";

import Styles from '../Styles';
import Keypad from './Keypad.js'
import CurrencyAmount from './CurrencyAmount.js'

import { updateTransferData, removeNFCCardError } from "../reducers/creditTransferReducer.js"
import SymbolicAmount from "./SymbolicAmount";
import {strings} from "../../locales/i18n";
import BottomAsyncButton from "./BottomAsyncButton";
import {parseEthQRCode} from "../utils";

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


class PaymentsKeypad extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currencyModalVisible: false,
            amount: null,
        };
    }

    componentDidMount() {
        this.fetchCopiedText()
    }

    setCurrencyModalVisible(visible) {
        this.setState({currencyModalVisible: visible});
    }

    fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        this._handleClipboard(text)
    };

    _handleClipboard(e) {
        try {
            var data = e.trim();  // trim removes spaces around a string

            var address = null;
            if (data.length === 42 && data.search(/[ghijklmnopqrstuvwyz]/i) === -1) {
                address = data
            } else if (data.slice(0, 9) === 'ethereum:') {
                address = data.slice(9,)
            }

            if (address) {
                // parse any query params

                let parsedObject = parseEthQRCode(address);

                if (Object.keys(parsedObject).length === 1) {
                    // it's just a normal wallet address

                    if (this.props.transferData.public_identifier !== parsedObject.address) {
                        Alert.alert(
                            `${strings('SendPaymentCameraScreen.ClipboardSend')}`,
                            `${parsedObject.address}`,
                            [{ text: strings('SendPaymentCameraScreen.Ok'), onPress: () => {this.props.updateTransferData({
                                    public_identifier: parsedObject.address,
                                    temp_transfer_mode: 'send'
                                });
                                    Vibration.vibrate(150, false);}, style: 'ok'},
                                { text: strings('SendPaymentCameraScreen.Cancel'), onPress: () => console.log('cancel'), style: 'cancel'}],
                        );
                    }
                }
            }
        } catch (e) {
            alert(e)
        }
    }

    handle_keypad_change(amount) {
        this.setState({
            amount: amount
        });
    }

    handleButtonClick(amount) {
        let key = this.makeKey();
        console.log('new key:', key)

        this.props.updateTransferData({
            transfer_amount: amount,
            transfer_random_key: key,
        });
    }

    makeKey() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < 4; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));


        return text;
    }

    openPaymentOptions() {
        const transfer_amount = this.state.amount;
        // const transfer_amount = this.props.transferData.transfer_amount;
        const transferAccount = this.props.transferAccounts.byId[this.props.login.transferAccountId];

        if (transferAccount.balance < transfer_amount) {
            Alert.alert(
                `${strings('ManualPayment.InvalidCode')}`,
                `${strings('SendPaymentCameraScreen.InsufficientFunds')}`,
                [{ text: strings('SendPaymentCameraScreen.Cancel'), onPress: () => console.log('cancel'), style: 'cancel'}],
            );
            return;
        }

        if (transfer_amount > 0) {
            if (this.props.transferData.public_identifier) {
                this.handleButtonClick(transfer_amount);
                console.log('navigating to payment logic')
                this.props.navigation.navigate('PaymentLogic')

                // this.props.createTransferRequest({
                //     'public_identifier': this.props.transferData.public_identifier,
                //     'transfer_amount': this.props.transferData.transfer_amount,
                //     'is_sending': true
                // });

            } else {
                this.handleButtonClick(transfer_amount);
                console.log('attempting offline payment nav')
                this.props.navigation.navigate('OfflinePayment')
            }
        } else {
            return
        }
    };

    openVendorPaymentOptions() {
        console.log('vendor payment options')

        this.props.removeNFCCardError()

        if (this.state.amount > 0) {
            this.handleButtonClick(this.state.amount);

            if (this.props.login.transferUsages.length === 0) {
                this.props.navigation.navigate('PaymentOption', { title: strings('GoBackNav.DefaultTitleText')} )
            } else {
                this.props.navigation.navigate('PaymentUse', { title: strings('GoBackNav.DefaultTitleText')} )
            }

        } else {
            return
        }
    };



    render() {
        const displayDecimals = this.props.login.displayDecimals;
        const transferAmount = this.state.amount;
        // const transferAmount = this.props.transferData.transfer_amount;
        // const transferAmount = this.props.transferAmount;
        const conversionRate = this.props.login.currencyConversionRate;

        // There should only ever be ONE transfer account.
        const transferAccount = this.props.transferAccounts.byId[this.props.login.transferAccountId];

        return (
            <View style={Styles.rootContainer}>

                <SymbolicAmount
                    modalVisible={this.state.currencyModalVisible}
                    toggleModalVisible={() => this.setCurrencyModalVisible(!this.state.currencyModalVisible)}
                    amount={transferAmount/100}
                    denominations={this.props.login.denominations}
                />

                <View style={Styles.displayContainer}>
                    <View>
                        <Text style={Styles.displayText}
                              onPress={() => this.setCurrencyModalVisible(!this.state.currencyModalVisible)}>
                            <CurrencyAmount amount={transferAmount/100} />
                        </Text>
                        {this.props.is_sending ?
                            <Text style={{textAlign: 'center', padding: 0, color: '#9B9B9B', fontSize: 16, marginTop: -22}}>
                                <Text style={{fontWeight: 'bold'}}><CurrencyAmount amount={transferAccount.balance / 100} /></Text> {strings('SendPaymentCameraScreen.Available')}
                            </Text> : null}
                    </View>

                </View>

                <View style={{flex: 6, paddingBottom: 60}}>
                    <Keypad
                        onChange={(amount) => this.handle_keypad_change(amount * (10 ** (2- displayDecimals))/conversionRate)}
                        value={transferAmount / ((10 ** (2 - displayDecimals))/conversionRate)}
                    />
                </View>

                {this.props.is_sending ?
                    <BottomAsyncButton buttonText={strings('SendPaymentCameraScreen.Send').toUpperCase()}
                                       isLoading={false} onPress={() => this.openPaymentOptions()}/>
                    :
                    <BottomAsyncButton buttonText={strings('NavBar.chargeButtonText').toUpperCase()}
                                       isLoading={false} onPress={() => this.openVendorPaymentOptions()}/>
                }
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsKeypad);
