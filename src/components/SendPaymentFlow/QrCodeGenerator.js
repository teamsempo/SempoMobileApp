import React, { Component } from 'react';
import { StyleSheet , View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {connect} from "react-redux";
import CryptoJS from 'crypto-js'
import {strings} from "../../../locales/i18n";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        transferData: state.creditTransfers.transferData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};


class QrCodeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    componentDidMount() {
        this.calculateData();

        // Toggle the state every second
        this.myInterval = setInterval(() => {
            this.calculateData()
        }, this.props.duration * 0.8
        );
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    calculateData() {

        let server_time_now = new Date().getTime() - this.props.login.localServerTimeDelta;

        let intervaled_time = (server_time_now - (server_time_now % (this.props.duration)))/(this.props.duration);

        let string_to_hash = (
            String(this.props.transferData.transfer_amount || '')
            + String(this.props.transferData.my_transfer_account_id)
            + intervaled_time.toString()
        );

        let hash = CryptoJS.enc.Hex.stringify(
            CryptoJS.HmacSHA256(
                string_to_hash,
                (this.props.login.secret || '').toString()
            )
        );

        let data = (
            String(this.props.transferData.transfer_amount || '')
            + '-' + String(this.props.transferData.my_transfer_account_id)
            + '-' + (this.props.login.userId|| '').toString()
            + '-' + hash.substring(0,6)
        );

        this.setState({data: data})
    }

    render() {

        if (this.state.data) {
            return (
                <View style={styles.QrContainer} accessibilityLabel={strings('CardScanScreen.QRCode')}>
                    <QRCode
                        value={this.state.data}
                        size={this.props.qrCodeSize}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.QrContainer}>
                </View>
            )
        }


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(QrCodeGenerator);


const styles = StyleSheet.create({
    QrContainer: {
        paddingVertical: 20,
        backgroundColor: '#ffffff',
    },
});