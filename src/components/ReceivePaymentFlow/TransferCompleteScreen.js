import React from 'react'
import { StyleSheet, Text, View, Image, BackHandler } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'

import { connect } from "react-redux";
import { resetTransferData } from "../../reducers/creditTransferReducer";
import { strings } from '../../../locales/i18n';

import TransferCompleteNotifier from "./TransferCompleteNotifier"

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyAmount from "../CurrencyAmount";
import {resetNFCStatus} from "../../reducers/nfcReducer";

const mapStateToProps = state => ({
    transferData: state.creditTransfers.transferData
});

const mapDispatchToProps = dispatch => ({
    resetTransferData: () => {
        dispatch(resetTransferData());
        dispatch(resetNFCStatus());
    },
});

class TransferCompleteScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => {
        return true;
    };

    render() {
        const { navigation, route } = this.props;

        const balance = route.params && route.params.balance;
        const user = route.params && route.params.user;

        return (
            <TransferCompleteNotifier
                navigation={navigation}
                balance={balance}
                user={user}
                transferData={this.props.transferData}
                resetTransferData={this.props.resetTransferData}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferCompleteScreen);