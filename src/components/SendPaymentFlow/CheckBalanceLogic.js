import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableNativeFeedback,
} from 'react-native'

import {connect} from "react-redux";

import { strings } from "../../../locales/i18n";
import CurrencyAmount from '../CurrencyAmount'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
        users: state.users,
        NFCTransceiveStatus: state.NFC.TransceiveStatus
    };
};

class CheckBalanceLogic extends React.Component {
    render() {

        // CHECK BALANCE MODAL CONTENTS & LOGIC
        if (this.props.users.getUserFromPublicSerialNumberStatus.isRequesting || this.props.NFCTransceiveStatus.isReading) {
            var title = strings('ReceiptUpload.Loading');

            var content = <ActivityIndicator size="large" />;

            var buttons = null;

        } else if (this.props.users.getUserFromPublicSerialNumberStatus.success === true) {
            title = this.props.users.getUserFromPublicSerialNumberStatus.load_result.message;

            content =
                <View style={{width: '100%', justifyContent: 'center'}}>
                    <Text style={styles.amountText}>
                        <CurrencyAmount amount={this.props.users.getUserFromPublicSerialNumberStatus.load_result.data.balance / 100} />
                    </Text>
                    <Text style={{textAlign: 'center', padding: 0, color: '#9B9B9B', fontSize: 16}}>
                        {strings('SendPaymentCameraScreen.CheckBalance', {identifier: this.props.public_serial_number})}
                    </Text>
                </View>;

            buttons =
                <View style={{width: '100%'}}>

                    <View style={{flexDirection: 'row', padding: 10, width: '100%'}} accessibilityLabel={strings('SendPaymentCameraScreen.Ok')}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                            <View style={[styles.payContainer, {justifyContent: 'center', backgroundColor: '#FFF', borderColor: '#D8D9DD', borderWidth: 2}]}>
                                <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Ok')}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                </View>

        } else if (this.props.users.getUserFromPublicSerialNumberStatus.error !== null) {
            title = (this.props.users.getUserFromPublicSerialNumberStatus.error.message === null ? 'Unknown Error' : this.props.users.getUserFromPublicSerialNumberStatus.error.message);

            content = <Icon name={'close-circle-outline'} size={100} color="#D0021B" backgroundColor="#FFF"/>;

            buttons =
                <View style={{flexDirection: 'row'}} accessibilityLabel={strings('SendPaymentCameraScreen.Ok')}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                        <View style={{justifyContent: 'center', paddingBottom: 20, paddingTop: 5, flex: 1}}>
                            <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Ok')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>

        } else if (this.props.NFCTransceiveStatus.success === true) {
            title = strings('SendPaymentCameraScreen.CardBalance');

            content =
                <View style={{width: '100%', justifyContent: 'center'}}>
                    <Text style={styles.amountText}>
                        <CurrencyAmount amount={this.props.NFCTransceiveStatus.balance / 100} />
                    </Text>
                    <Text style={{textAlign: 'center', padding: 0, color: '#9B9B9B', fontSize: 16}}>
                        {strings('SendPaymentCameraScreen.CheckBalance', { identifier: this.props.NFCTransceiveStatus.nfcId })}
                    </Text>
                </View>;

            buttons =
                <View style={{width: '100%'}} accessibilityLabel={strings('SendPaymentCameraScreen.Ok')}>

                    <View style={{flexDirection: 'row', padding: 10, width: '100%'}}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                            <View style={[styles.payContainer, {justifyContent: 'center', backgroundColor: '#FFF', borderColor: '#D8D9DD', borderWidth: 2}]}>
                                <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Ok')}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                </View>
        } else {
            title = null;

            content = null;

            buttons = null;
        }

        // if (this.props.nfcCheckBalance && title === null) {
        //     return null; // this will stop the balance modal showing until needed.
        // }

        // CHECK BALANCE MODAL
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

export default connect(mapStateToProps, null)(CheckBalanceLogic);

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