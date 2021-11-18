import React from 'react'
import {
    View,
    Text,
    TouchableNativeFeedback,
    Alert, Animated, Platform, StyleSheet
} from 'react-native'
import {connect} from "react-redux";

import {isRTL, strings} from '../../../locales/i18n';

import Styles from '../../Styles';
import InputButton from '../InputButton';
import PaymentAmountButton from '../PaymentAmountButton'
import PaymentsKeypad from "../PaymentsKeypad"
import { updateTransferData } from "../../reducers/creditTransferReducer.js"
import {createTransferRequest} from "../../reducers/creditTransferReducer";
import BottomAsyncButton from "../BottomAsyncButton";
import PaymentModeSwitcher from "../PaymentModeSwitcher";
import ExitToHome from "../ExitToHome"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        createTransferRequest: (body) => dispatch(createTransferRequest({body})),
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
    };
};


class PaymentAmountScreen extends React.Component {

    componentDidMount(){
        this.props.updateTransferData({
            is_sending: true
        });
    }

    componentWillUnmount() {
        this.props.updateTransferData({
            is_sending: false,
            temp_transfer_mode: null,  // resets ETH transfer
            public_identifier: null,
            transfer_amount: null,
        });
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    openPaymentOptions() {
        const transfer_amount = this.props.transferData.transfer_amount;
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
                console.log('navigating to payment logic')
                this.props.navigation.navigate('PaymentLogic')

                // this.props.createTransferRequest({
                //     'public_identifier': this.props.transferData.public_identifier,
                //     'transfer_amount': this.props.transferData.transfer_amount,
                //     'is_sending': true
                // });

            } else {
                console.log('attempting offline payment nav')
                this.props.navigation.navigate('OfflinePayment')
            }
        } else {
            return
        }
    };

    render() {
        const transferAccount = this.props.login.transferAccountId && this.props.transferAccounts.byId[this.props.login.transferAccountId];
        let toText = null;

        if (this.props.transferData.public_identifier) {
            let identifier = String(this.props.transferData.public_identifier).slice(0,6);
            toText = (
                <Text style={styles.vendorText}>
                    {strings('SendPaymentCameraScreen.To', { vendor: `${identifier}...` })}
                </Text>
            )
        }

        return (
            <View style={Styles.rootContainer}>
                <View style={[{ flex: .15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#FFF' }]} >
                    <ExitToHome navigation={this.props.navigation} color='#000'/>

                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 3, height: '100%'}}>
                        <PaymentModeSwitcher send={true} dark={true} />
                        {/*<Text style={Styles.title}>{capitalize(transferDirection)}</Text>*/}
                    </View>

                    <ShareWallet transferAccount={transferAccount} color='#000'/>
                </View>

                {toText}

                <PaymentsKeypad is_sending={true} navigation={this.props.navigation} />
                {/*<BottomAsyncButton buttonText={strings('SendPaymentCameraScreen.Send').toUpperCase()} isLoading={false} onPress={() => this.openPaymentOptions()}/>*/}
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentAmountScreen);


const styles = StyleSheet.create({
    vendorText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#4A4A4A',
        backgroundColor: '#FFF'
    }
});
