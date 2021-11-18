import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'

import {loadUser} from "../reducers/userReducer";
import { strings } from '../../locales/i18n';

import CurrencyAmount from './CurrencyAmount'

import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        user: state.user,
        transferAccounts: state.transferAccounts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUser: (payload) => dispatch(loadUser(payload)),
    };
};

class BalanceInfo extends React.Component {

    componentDidMount() {
        if (!this.props.user.loadStatus.success) {
            this.props.loadUser()
        }
    }


    render() {
        const displayDecimals = this.props.login.displayDecimals;

        const vendor_info = this.props.transferAccounts.byId[Object.keys(this.props.transferAccounts.byId)[0]];

        var extra_info_text = `${strings('SettingsScreen.ExtraInfoDefault')}`;

        if (this.props.transferAccountInfo.isRequesting) {
            var balance = <ActivityIndicator/>
        } else {
            balance = <Text style={styles.title}>
                <CurrencyAmount amount={(vendor_info.transfer_account.balance / 100).toFixed(displayDecimals)} />
                {/*{strings('Defaults.Amount', {amount: (vendor_info.balance / 100).toFixed(displayDecimals)})}*/}
                </Text>
        }

        return (
            <View style={styles.topContainer} accessibilityLabel={extra_info_text}>
                {balance}
                <Text style={styles.subtitle}>
                    {extra_info_text}
                </Text>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BalanceInfo);

const styles = StyleSheet.create({
    topContainer: {
        flex: 3,
        backgroundColor: '#F2F4F5',
        justifyContent: 'center',
    },
    title: {
        color: '#3D454C',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
});