import React from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native'

import {connect} from "react-redux";
import InputButton from './InputButton'
import Styles from "../Styles";

const mapStateToProps = (state) => {
    return {
        withdrawalInitialisation: state.withdrawalInitialisation,
        users: state.users
    };
};

class WithdrawalRequestButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    openWithdrawalAmountScreen() {
        this.props.navigation.navigate('WithdrawalAmountScreen')
    }

    render() {

        const vendor_info = this.props.users.byId[Object.keys(this.props.users.byId)[0]];


        if (vendor_info.pending_widthdrawal_amount) {
            return (
                <Text style={Styles.inputButtonText}>
                    Withdrawal of ${vendor_info.pending_widthdrawal_amount/100} pending
                </Text>
            )
        } else if (this.props.withdrawalInitialisation.isRequesting) {
            return <Text style={Styles.inputButtonText}>Loading</Text>
        } else if (this.props.withdrawalInitialisation.success) {
            return <Text style={Styles.inputButtonText}>Withdrawal Request Pending</Text>
        } else if (this.props.withdrawalInitialisation.error) {
            return <Text style={Styles.inputButtonText}>{this.props.withdrawalInitialisation.error}</Text>
        }

        return (
            <TouchableHighlight style={Styles.inputButton}
                                underlayColor="#F2F4F5"
                                onPress={() => this.openWithdrawalAmountScreen()}>
                <Text style={Styles.inputButtonText}>{'Request Withdrawal'}</Text>
            </TouchableHighlight>
        )


    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawalRequestButton);