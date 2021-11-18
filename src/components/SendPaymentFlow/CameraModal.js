'use strict';
import React, { Component } from 'react';
import {View, Modal, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

import {connect} from "react-redux";

import PaymentLogic from './PaymentLogic'
import FeedbackLogic from './FeedbackLogic'
import CheckBalanceLogic from "./CheckBalanceLogic";

const mapStateToProps = (state) => {
    return {
        newTransferStatus: state.creditTransfers.createStatus,
        login: state.login,
        users: state.users,
    };
};

class CameraModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        console.log('this.props.getFeedback', this.props.getFeedback)
        console.log('this.props.newTransferStatus.feedback', this.props.newTransferStatus.feedback)
        console.log('this.props.checkBalanceFeedback',this.props.checkBalanceFeedback)

        if ((this.props.getFeedback && this.props.newTransferStatus.feedback === true) || this.props.checkBalanceFeedback) {
            // RENDER FEEDBACK COMPONENT
            var contents =
                <FeedbackLogic
                    _resetModal={() => this.props._resetModal()}
                    _handleAdditionalInformation={(additional_information) => this.props._handleAdditionalInformation(additional_information)}
                    _sendFeedback={() => this.props._sendFeedback()}
                    _handleFeedbackRating={(question, rating) => this.props._handleFeedbackRating(question, rating)}
                    getAdditionalFeedback={this.props.getAdditionalFeedback}
                    getFeedback={this.props.getFeedback}
                    checkBalanceFeedback={this.props.checkBalanceFeedback}
                    additional_information={this.props.additional_information}
                />
        } else if (this.props.scanData || this.props.newTransferStatus.error !== null || this.props.newTransferStatus.success === true || this.props.newTransferStatus.isRequesting === true) {
            // RENDER PAYMENT COMPONENT
            contents =
                <PaymentLogic
                    _resetModal={() => this.props._resetModal()}
                    _handleCompletePayment={() => this.props._handleCompletePayment()}
                    amount={this.props.amount}
                    vendor={this.props.vendor}
                    scanData={this.props.scanData}
                    navigation = {this.props.navigation}
                    vendorScan={this.props.vendorScan}
                />
        } else if (this.props.checkBalance) {
            // RENDER CHECK BALANCE
            contents =
                <CheckBalanceLogic
                    _resetModal={() => this.props._handleCheckBalanceFeedback()}
                    public_serial_number={this.props.public_serial_number}
                />
        }

        // CAMERA MODAL (PAYMENT & FEEDBACK)
        if (this.props.modalVisible) {
            return (
                <Modal
                  transparent={true}
                  animationType={'slide'}
                  onRequestClose={() => this.props._resetModal()}>

                    <View style={styles.modalBackground} onPress={() => this.props._resetModal()}>
                        <TouchableOpacity style={{flex: 1, width: '100%'}} onPress={() => this.props._resetModal()}/>
                        <View style={styles.paymentModalWrapper}>
                          {contents}
                        </View>
                    </View>

                </Modal>
            )
        } else {
            return(
                <View/>
            )
        }
    }
}
export default connect(mapStateToProps, null)(CameraModal);


const styles = StyleSheet.create({

    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#00000040'
    },
    paymentModalWrapper: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#FFFFFF',
        height: Dimensions.get('window').height * 0.52,
        width: '100%',
        borderRadius: 10,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        alignItems: 'center',
    }
});