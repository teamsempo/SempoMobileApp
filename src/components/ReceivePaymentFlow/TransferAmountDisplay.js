import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';

import CurrencyAmount from '../CurrencyAmount'
import SymbolicAmount from "../SymbolicAmount";

const mapStateToProps = (state) => {
    return {
        transferData: state.creditTransfers.transferData,
        login: state.login,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class TransferAmountDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currencyModalVisible: false,
        };
    }

    setCurrencyModalVisible(visible) {
        this.setState({currencyModalVisible: visible});
    }

    render() {
        const displayDecimals = this.props.login.displayDecimals;
        const transferAmount = (this.props.transferData.transfer_amount/100).toFixed(displayDecimals);

        return (
            <View>
                <SymbolicAmount
                    modalVisible={this.state.currencyModalVisible}
                    toggleModalVisible={() => this.setCurrencyModalVisible(!this.state.currencyModalVisible)}
                    amount={transferAmount}
                    denominations={{
                        200: {type: 'note', 'size': 1, color: '#b8594c'},
                        500: {type: 'note', 'size': 1.1, color: '#845694'},
                        1000: {type: 'note', 'size': 1.2, color: '#d3b38c'},
                        2000: {type: 'note', 'size': 1.3, color: '#9ac8a4'},
                        5000: {type: 'note', 'size': 1.4, color: '#ffeb60'},
                        10000: {type: 'note', 'size': 1.5, color: '#68adf8'},
                    }}
                />

                <Text style={styles.inputValueText} onPress={() => this.setCurrencyModalVisible(!this.state.currencyModalVisible)}>
                    <CurrencyAmount amount={transferAmount}/>
                </Text>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferAmountDisplay);


const styles = StyleSheet.create({
    inputValueText: {
        color: '#3D454C',
        fontSize: 38,
        fontWeight: 'bold',
    }
});
