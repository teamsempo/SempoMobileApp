import React from 'react'
import {StyleSheet, Text, View, Image, Linking, Dimensions} from 'react-native'
import {connect} from "react-redux";

import Styles from '../../Styles';
import PaymentLogic from './PaymentLogic.js'
import {createTransferRequest, RESET_NEW_TRANSFER, RESET_TRANSFER_DATA} from "../../reducers/creditTransferReducer";
import {RESET_NEW_FEEDBACK_DATA} from "../../reducers/feedbackReducer";
import {tracker} from "../../analytics";


const mapStateToProps = (state) => {
    return {
        transferData: state.creditTransfers.transferData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetNewTransfer: () => {
            dispatch({type: RESET_NEW_TRANSFER});
            dispatch({type: RESET_NEW_FEEDBACK_DATA});
            dispatch({type: RESET_TRANSFER_DATA})
        },
        createTransferRequest: (body) => dispatch(createTransferRequest({body})),

    };
};


class PaymentLogicScreen extends React.Component {

  _handleCompletePayment() {
      this.props.resetNewTransfer();
      this.props.navigation.popToTop();
      this.props.navigation.navigate('Home');
  }

    _resetModal() {
      console.log("triggering resetModal")
        this.props.resetNewTransfer();
        this.props.navigation.goBack();
    }

  _handleBeneficiaryTransferWithVendorQRCode() {

      var transferData = this.props.transferData;

      tracker.logEvent("PaymentRequestSend", transferData);
      this.props.createTransferRequest({
          'transfer_amount': transferData.transfer_amount,
          'public_identifier': transferData.public_identifier,
          'is_sending': true
      });
  }

  render() {

      return (
          <View style={Styles.rootContainer}>
              <View style={styles.paymentModalWrapper}>
                <PaymentLogic
                    _resetModal={() => this._resetModal()}
                    _handleCompletePayment={() => this._handleCompletePayment()}
                    _handleBeneficiaryTransferWithVendorQRCode={() => this._handleBeneficiaryTransferWithVendorQRCode()}
                    externalAddressTransfer={true}
                />
              </View>
          </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentLogicScreen);


const styles = StyleSheet.create({

    paymentModalWrapper: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});