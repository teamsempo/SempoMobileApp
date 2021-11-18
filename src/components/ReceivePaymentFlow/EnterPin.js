import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';

import TransferAmount from './TransferAmountDisplay'
import Keypad from '../Keypad'
import Styles from "../../Styles";
import { createTransferRequest } from "../../reducers/creditTransferReducer";

const mapStateToProps = (state) => {
    return {
        newTransferStatus: state.creditTransfers.createStatus,
        transferData: state.creditTransfers.transferData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createTransferRequest: (body) => dispatch(createTransferRequest({body}))
    };
};

class EnterPin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pin: '',
            missing_pin: false,
            incorrect_pin: false,
        };
        this._handleChange = this._handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({incorrect_pin: (nextProps.newTransferStatus.error)});
    }

    _handleChange(pin) {
        this.setState(pin);
    }

    _handleQrTransfer() {
        if (this.state.pin.length < 4) {
            this.setState({missing_pin: true});
            return
        }

        this.setState({missing_pin: false});
        this.props.createTransferRequest({
            'public_identifier': this.props.transferData.public_identifier,
            'nfc_id': null,
            'transfer_amount': this.props.transferData.transfer_amount,
            'transfer_use': this.props.transferData.transfer_use,
            'pin': this.state.pin
        })
    }

    _onConfirmTransfer() {
        this._handleQrTransfer()
    }

    render() {
        if (this.props.newTransferStatus.isRequesting) {
            return (
                <View style={styles.rootContainer}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator />
                        <StatusBar barStyle="default" />
                    </View>
                </View>
            )
        } else {

            const inputButtons = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [
                    {value: 'B', display: <Icon name="backspace" size={20} color="#3D454C"/>},
                    0,
                    {value: 'S', display: <Icon name="check-circle" size={20} color="#3D454C"/>}
                ]
            ];


            if (this.props.newTransferStatus.error) {
                var inner_text = (
                    <Text style={{marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center', color: 'red'}}>
                        {this.props.newTransferStatus.error.message}
                    </Text>
                )
            } else if (this.state.missing_pin) {
                inner_text = (
                    <Text style={{marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center', color: 'red'}}>
                        {strings('EnterPin.MissingPin')}
                    </Text>
                )
            } else {
                inner_text = (
                    <Text style={{marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center'}}>
                        {strings('EnterPin.EnterPinText')}
                    </Text>
                )
            }

            return (
                <View style={styles.rootContainer}>
                    <View style={styles.promptContainer}>

                        <TransferAmount/>

                        { inner_text }

                    </View>

                    <View style={styles.pinDisplayContainer}>

                        <Text style={Styles.displayText}>
                            {"* ".repeat(Math.max(this.state.pin.length - 1,0)) + this.state.pin.slice(-1)}
                        </Text>

                    </View>

                    <Keypad value={this.state.pin} inputButtons={inputButtons} onChange={(pin) => this.setState({pin})} onSubmit={() => this._onConfirmTransfer()}/>
                </View>
            )
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EnterPin);


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainContainer: {
        flex: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promptContainer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinDisplayContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    }
});