import React, { Component } from 'react';
import {connect} from "react-redux";

import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';

import { strings } from '../../../locales/i18n';

import SecondIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import CurrencyAmount from '../CurrencyAmount'

import { updateTransferData } from "../../reducers/creditTransferReducer.js";

const mapStateToProps = (state) => {
    return {
        transferData: state.creditTransfers.transferData,
        login: state.login
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransferData: (payload) => dispatch(updateTransferData(payload)),
    };
};

class NavBar extends Component {
    openPaymentOptions() {
        if (this.props.transferData.transfer_amount > 0) {
            this.props.navigation.navigate('PaymentUse')
        } else {
            return
        }
    };

    openRefund() {
        if (this.props.transferData.transfer_amount > 0) {
            this.props.navigation.navigate('Camera')
        } else {
            return
        }
    };

    render() {
        const displayDecimals = this.props.login.displayDecimals;

        if (this.props.transferData.is_sending) {
            // REFUND
            var chargeContainer =
                <TouchableHighlight underlayColor='#FBADA1' style={[styles.chargeButton, {backgroundColor: '#FBADA1'}]}
                                    onPress={() => this.openRefund()}>
                    <Text style={styles.chargeButtonText}>{strings('NavBar.refundButtonText') + ' '}
                        <CurrencyAmount amount = {this.props.transferData.transfer_amount/100}/>
                    </Text>

                </TouchableHighlight>
        } else {
            // CHARGE
            chargeContainer =
                <TouchableHighlight underlayColor='#298F91' style={styles.chargeButton}
                                    onPress={() => this.openPaymentOptions()}>
                    <Text style={styles.chargeButtonText}>
                        {strings('NavBar.chargeButtonText')  + ' '}
                        <CurrencyAmount amount={this.props.transferData.transfer_amount/100}/>
                    </Text>

                </TouchableHighlight>
        }

        const transferDirection = this.props.transferData.is_sending? 'charge' : 'refund';

        if (this.props.payments) {
            return (
                <View style={styles.paymentsContainer}>
                    <View style={[styles.container, {justifyContent: 'space-between'}]}>
                        {/*<Icon.Button iconStyle={{marginLeft: 10}} name="menu" size={30} color="#3D454C"*/}
                                     {/*backgroundColor="#F2F4F5" onPress={() => this.props.navigation.openDrawer()}/>*/}
                        <SecondIcon.Button iconStyle={{display: (this.props.login.isSupervendor === true ? 'flex' : 'none'), marginLeft: 10}} name="swap-vertical" size={30} color="#3D454C"
                                     backgroundColor="#F2F4F5" onPress={() => this.props.updateTransferData({is_sending: !this.props.transferData.is_sending})}/>
                    </View>
                    <View style={styles.chargeContainer}>
                        {chargeContainer}
                    </View>
                </View>
            )
        } if (this.props.export) {
            return(
                <View style={styles.rootContainer}>
                    <View style={[styles.container, {justifyContent: 'space-between'}]}>
                        <View style={[styles.container, {flexDirection: 'row'}]}>
                            {/*<Icon.Button iconStyle={{marginLeft: 10}} name="menu" size={30} color="#3D454C"*/}
                                         {/*backgroundColor="#F2F4F5" onPress={() => this.props.navigation.openDrawer()}/>*/}
                            <Text style={styles.text}>{this.props.title}</Text>
                        </View>
                        <SecondIcon.Button iconStyle={{display: (this.props.login.isSupervendor === true ? 'flex' : 'none'), marginLeft: 10}} name="file-export" size={30} color="#3D454C"
                                           backgroundColor="#F2F4F5" onPress={() => this.props.navigation.navigate('ExportScreen')}/>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.rootContainer}>
                    <View style={styles.container}>
                        <SecondIcon.Button iconStyle={{marginLeft: 10}} name="menu" size={30} color="#3D454C"
                                     backgroundColor="#F2F4F5" onPress={() => this.props.navigation.openDrawer()}/>
                        <Text style={styles.text}>{this.props.title}</Text>
                    </View>
                </View>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);


const styles = StyleSheet.create({
    rootContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F4F5',
        borderBottomWidth: 2,
        borderColor: '#C2C7CC',
    },
    paymentsContainer: {
        flex: 2.5,
        borderBottomWidth: 2,
        borderColor: '#C2C7CC',
        backgroundColor: '#F2F4F5',
    },
    chargeContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    chargeButton: {
        padding: 10,
        backgroundColor: '#2D9EA0',
        justifyContent: 'center',
    },
    chargeButtonText: {
        color: '#FFF',
        fontSize: 24,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        color: '#3D454C',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
