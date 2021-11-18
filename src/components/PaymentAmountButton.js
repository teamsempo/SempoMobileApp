import React, { Component } from 'react';
import {connect} from "react-redux";

import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

import { strings } from '../../locales/i18n';

import CurrencyAmount from './CurrencyAmount'

const mapStateToProps = (state) => {
    return {
        transferData: state.creditTransfers.transferData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class NavBar extends Component {

    render() {
        return (

            <View style={styles.chargeContainer}>
                <TouchableHighlight underlayColor='#298F91' style={styles.chargeButton}
                                    onPress={() => this.props.nextPaymentStep()} accessibilityLabel={strings('SendPaymentCameraScreen.Send')}>
                    <Text style={styles.chargeButtonText}>
                        {strings('SendPaymentCameraScreen.Send') + ' '}
                        <CurrencyAmount amount={this.props.transferData.transfer_amount/100}/>
                    </Text>

                </TouchableHighlight>
            </View>
        )
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
