import React, { Component } from 'react';
import { Animated, StyleSheet , View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {connect} from "react-redux";
import Pusher from 'pusher-js/react-native';

import {generateQueryString, getHostURL, getToken} from '../../utils'

import { CREATE_TRANSFER_SUCCESS } from '../../reducers/creditTransferReducer'

const mapStateToProps = (state) => {
    return {
        login: state.login,
        transferData: state.creditTransfers.transferData,
        transferAccounts: state.transferAccounts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        newTransferSuccess: () => dispatch({type: CREATE_TRANSFER_SUCCESS})
    };
};


class RequestPaymentQrCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pusherChannel: null
        };
    }

    async componentDidMount() {

        let pusher = new Pusher(this.props.login.pusherKey, {
            authEndpoint: await getHostURL() + '/api/v1/pusher/auth',
            auth: {
                headers: {
                    'Authorization': await getToken(),
                }
            },
            cluster: 'ap1',
            encrypted: true,
            activityTimeout: 6000
        });

        if (pusher) {
            pusher.logToConsole = true;

            const privateUserChannel = pusher.subscribe(
                'private-user-' + this.props.login.deploymentName + '-' + this.props.login.userId
            );

            this.setState(
                {pusherChannel: privateUserChannel},
                () => {this.bindChannel(this.state.pusherChannel)}
            );
        }
    }

    componentWillUnmount() {
        if (this.state.pusherChannel) {
            this.unbindChannel(this.state.pusherChannel)
        }
    }

    bindChannel(channel) {
        channel.bind('payment_confirmed', (data) => {
            if (data.transfer_random_key === this.props.transferData.transfer_random_key) {
                this.props.navigation.navigate('TransferCompleteScreen');
                this.props.newTransferSuccess()
            }
        })
    }

    unbindChannel(channel) {
        channel.unbind('payment_confirmed')
    }


    render() {
        const { login, transferAccounts, transferData } = this.props;

        const blockchainAddressType = 'ethereum:';

        let myAccount =  transferAccounts.byId[transferData.my_transfer_account_id];
        const blockchainAddress = (myAccount && myAccount.blockchain_address) || '';

        let name = (login.firstName || '').toString() + ' ' + (login.lastName || '').toString();
        let amount = Math.round(transferData.transfer_amount/100 * 1000)/1000; //allow at most 3 decimal places, and remove cents
        let transfer_use = transferData.transfer_use;
        let user_id = login.userId;
        let token_symbol = transferData.token_symbol;
        let random_key = transferData.transfer_random_key;

        const metadata = generateQueryString({
            'amount': amount,
            'n': name,
            'tu': transfer_use,
            'u': user_id,
            's': token_symbol,
            'r': random_key,
        });

        let qr_data = blockchainAddressType + blockchainAddress + metadata;
        //ethereum:0xd25562a703f734a69405E7e1Dc4dd3B5EDabf0b9?amount=1000&f=Tristan&l=Cole&u=&rk=35E6

        return (
            <View style={styles.QrContainer}>
                <QRCode
                    value={qr_data}
                    size={this.props.qrCodeSize}

                />
            </View>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RequestPaymentQrCode);


const styles = StyleSheet.create({
    QrContainer: {
        padding: 10,
        backgroundColor: '#ffffff',
    },
});