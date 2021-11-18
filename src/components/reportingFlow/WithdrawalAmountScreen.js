import React from 'react'
import {connect} from "react-redux";
import { StyleSheet, Text, View, Image,ActivityIndicator, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Styles from '../../Styles';
import GoBackNav from "../nav/GoBackNav";
import Keypad from '../Keypad'
import { strings } from '../../../locales/i18n';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        transferAccount: state.transferAccount,
        withdrawalInitialisation: state.withdrawalInitialisation
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};


class WithdrawalAmountScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transfer_amount: '',
            requesting_withdrawal: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({requesting_withdrawal: nextProps.withdrawalInitialisation.isRequesting});
    }

    _onConfirmTransfer() {
        if (this.state.transfer_amount !== '') {
            this.props.initialiseWithdrawal({'withdrawal_amount': this.state.transfer_amount});
        }
    };

    render() {
        const displayDecimals = this.props.login.displayDecimals;
        const transferAccount = this.props.transferAccounts.byId[Object.keys(this.props.transferAccounts.byId)[0]];

        const inputButtons = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [
                'C',
                0,
                {value: 'S', display: <Icon name="check-circle" size={20} color="#3D454C"/>}
            ]
        ];

        if (this.state.requesting_withdrawal) {
            return (
                <View style={styles.container}>
                    <GoBackNav navigation={this.props.navigation}/>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator/>
                        <StatusBar barStyle="default"/>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <GoBackNav navigation={this.props.navigation} title={strings("WithdrawalAmountScreen.Title")}/>
                    <View style={styles.withdrawalAmountDisplayContainer}>
                        <Text style={Styles.displayText}>
                            {strings("Defaults.CurrencySymbol")}{(this.state.transfer_amount / 100).toFixed(displayDecimals)}
                        </Text>
                        <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 20,
                            marginRight: 20,
                            textAlign: 'center'
                        }}>
                            {strings("WithdrawalAmountScreen.Balance", {amount: strings("Defaults.CurrencySymbol") + (transferAccount.balance / 100).toFixed(displayDecimals) + strings("Defaults.Currency") })}
                        </Text>
                    </View>
                    <Keypad value={this.state.transfer_amount} inputButtons={inputButtons}
                            onChange={(transfer_amount) => this.setState({transfer_amount})}
                            onSubmit={() => this._onConfirmTransfer()}/>
                </View>
            )
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WithdrawalAmountScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainContainer: {
        flex: 11,
        backgroundColor: '#FFF',
        margin: 20,
    },
    loadingContainer: {
        flex: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    text: {
        color: '#3D454C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    withdrawalAmountDisplayContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
});