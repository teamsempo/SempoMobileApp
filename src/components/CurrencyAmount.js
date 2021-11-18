import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Dimensions,
    Picker,
    Alert,
    TouchableNativeFeedback } from 'react-native'

import SymbolicAmount from "./SymbolicAmount.js"

import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        login: state.login,
    };
};

class CurrencyAmount extends React.Component {
    constructor(props) {
        super(props);
        state = {
            modalVisible: false,
        };
    }


    render() {
        let { login, currencyCode } = this.props;


        let convertedAmount = this.props.amount * login.currencyConversionRate;

        try {
            var fixedAmount = convertedAmount.toFixed(login.displayDecimals)
        } catch (e) {
            fixedAmount = convertedAmount
        }

        if(isNaN(fixedAmount)) {
            return (
                <Text>{'-- ' + (currencyCode !== null ? currencyCode : login.currencySymbol)}</Text>
            )
        }

        return (
            <Text>
                {fixedAmount + ' ' + (currencyCode !== null ? currencyCode : login.currencySymbol)}
            </Text>
        )
    }
}
export default connect(mapStateToProps, null)(CurrencyAmount);

CurrencyAmount.defaultProps = {
    amount: 0,
    currencyConversionRate: 0,
    currencySymbol: null,
    currencyCode: null,
    displayDecimals: 0,
};