'use strict';
import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    TouchableOpacity,
} from 'react-native';

import CurrencyAmount from '../CurrencyAmount'

import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { updateTransferData } from '../../reducers/creditTransferReducer.js'
import {createTransferRequest} from "../../reducers/creditTransferReducer";


const mapStateToProps = (state) => {
    return {
        newTransferStatus: state.creditTransfers.createStatus,
        transferAccounts: state.transferAccounts,
        login: state.login,
        transferData: state.creditTransfers.transferData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
        createTransferRequest: (body) => dispatch(createTransferRequest({body})),
    };
};

class PaymentLogic extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handle_go_to_offline() {
        var amount = this.props.transferData.transfer_amount;
        this.props._resetModal();
        this.props.updateTransferData({
            transfer_amount: amount,
            temp_transfer_mode: 'send'
        });
        if (amount !== null) {
            this.props.navigation.navigate('OfflinePayment');
        }
    }

    _handleTransferWithVendorQRCode() {
        this.props.createTransferRequest({
            'nfc_id': null,
            'qr_id': null,
            'public_identifier': this.props.transferData.public_identifier,
            'transfer_account_id': this.props.transferData.transfer_account_id,
            'user_id': this.props.transferData.user_id,
            'my_transfer_account_id': this.props.transferData.my_transfer_account_id,
            'is_sending': true,
            'token_symbol': this.props.transferData.token_symbol,
            'transfer_amount': this.props.transferData.transfer_amount,
            'transfer_use': this.props.transferData.transfer_use,
            'transfer_random_key': this.props.transferData.transfer_random_key
        });
    }


    render() {

        let { my_matching_transfer_accounts } = this.props.transferData;

        let no_matching_transfer_account;
        if (my_matching_transfer_accounts) {
            no_matching_transfer_account = my_matching_transfer_accounts.length === 0
        } else {
            no_matching_transfer_account = true;
        }

        let transferAccount = this.props.transferAccounts.byId[this.props.transferData.my_transfer_account_id];
        if (transferAccount) {
            var newBalanceCalc = transferAccount.balance - (this.props.transferData.transfer_amount);
        }
        let displayBalance = (newBalanceCalc / 100).toFixed(2);

        // PAYMENT MODAL CONTENTS & LOGIC
        if (this.props.newTransferStatus.isRequesting === true) {
            var title = strings('SendPaymentCameraScreen.Processing');

            var content = <ActivityIndicator size="large" />;

            var buttons = null;

        } else if (this.props.newTransferStatus.success === true) {
            title = strings('SendPaymentCameraScreen.Success');

            content = <Icon name={'check-circle-outline'} size={100} color="#2D9EA0"
                            backgroundColor="#FFF"/>;

            buttons =
                <View style={{flexDirection: 'row', padding: 10, paddingTop: 0}} accessibilityLabel={strings('SendPaymentCameraScreen.Next')}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleCompletePayment()}>
                        <View style={[styles.payContainer, {justifyContent: 'center', marginTop: 0}]}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFF'}}>{strings('SendPaymentCameraScreen.Next')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>

        } else if (this.props.newTransferStatus.error !== null) {
            if (this.props.newTransferStatus.error.message) {
                title = this.props.newTransferStatus.error.message
            } else if (no_matching_transfer_account) {
                var title = strings('SendPaymentCameraScreen.NoWallet') + String(this.props.transferData.token_symbol)
            } else {
                title = 'Unknown Error'
            }

            content = <Icon name={'close-circle-outline'} size={100} color="#D0021B" backgroundColor="#FFF"/>;

            if (title.includes("Something went wrong") && !this.props.vendorScan && !this.props.externalAddressTransfer) {
                buttons =
                <View style={{flexDirection: 'row'}} accessibilityLabel={strings('SendPaymentCameraScreen.OfflinePayment')}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.handle_go_to_offline()}>
                        <View style={{justifyContent: 'center', paddingBottom: 20, paddingTop: 5, flex: 1}}>
                            <Text style={styles.feedbackText}>
                                {strings('SendPaymentCameraScreen.OfflinePayment')}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            } else {
                buttons =
                <View style={{flexDirection: 'row'}} accessibilityLabel={strings('SendPaymentCameraScreen.Ok')}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                        <View style={{justifyContent: 'center', paddingBottom: 20, paddingTop: 5, flex: 1}}>
                            <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Ok')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            }

        } else  {
            title = strings('SendPaymentCameraScreen.Payment');

            content =
                <View style={{width: '100%', justifyContent: 'center'}}>

                    <Text style={styles.amountText}>
                        <CurrencyAmount amount={this.props.transferData.transfer_amount/100} />
                    </Text>
                    <Text style={styles.vendorText}>{strings('SendPaymentCameraScreen.To', { vendor: this.props.transferData.transfer_account_name || this.props.transferData.public_identifier })}</Text>
                </View>;

            buttons =
                <View style={{width: '100%'}}>
                    <Text style={{textAlign: 'center', padding: 0, color: '#9B9B9B', fontSize: 16}}>
                        {strings('SendPaymentCameraScreen.NewBalance')}
                    <Text style={{fontWeight: 'bold'}}>
                        <CurrencyAmount amount={displayBalance} />
                    </Text>
                    </Text>

                    <View style={{flexDirection: 'row', padding: 10, width: '100%'}} accessibilityLabel={strings('PaymentsOptionScreen.PaymentOption')}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                            <View style={[styles.payContainer, {justifyContent: 'center', backgroundColor: '#FFF', borderColor: '#D8D9DD', borderWidth: 2}]} accessibilityLabel={strings('SendPaymentCameraScreen.Cancel')}>
                                <Icon name={'close'} size={30} color="#D8D9DD"
                                      backgroundColor="#FFF"/>
                            </View>
                        </TouchableNativeFeedback>

                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this._handleTransferWithVendorQRCode()}>
                            <View style={[styles.payContainer, {justifyContent: 'center'}]} accessibilityLabel={strings('SendPaymentCameraScreen.Send')}>
                                <Icon name={'check'} size={30} color="#FFF"
                                      backgroundColor="#2D9EA0"/>
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                </View>
        }

        // PAYMENT MODAL
        return (
            <View style={[styles.paymentWrapper]}>
              <Text style={[styles.title]}>
                {title}
                </Text>
                <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                  {content}
                </View>
                {buttons}
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentLogic);

const styles = StyleSheet.create({
    title: {
        color: '#4A4A4A',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderColor: '#F7F7F7'
    },
    amountText: {
        color: '#4A4A4A',
        fontSize: 40,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingBottom: 10,
    },
    vendorText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#4A4A4A',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#00000040'
    },
    paymentWrapper: {
        alignItems: 'center',
    },
    payContainer: {
        flex: 1,
        backgroundColor: '#2D9EA0',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        height: 55,
        margin: 10,
    },
    feedbackText: {
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        color: '#9B9B9B'
    }
});