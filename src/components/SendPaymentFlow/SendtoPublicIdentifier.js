import React from 'react';
import { connect } from 'react-redux';
import {StyleSheet, TextInput, View, Text, Linking } from 'react-native';

import { strings } from '../../../locales/i18n';

import AsyncButton from "../common/AsyncButton";
import {createTransferRequest, updateTransferData} from "../../reducers/creditTransferReducer";

const mapStateToProps = (state) => {
    return {
        transferData: state.creditTransfers.transferData
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        createTransferRequest: (body) => dispatch(createTransferRequest({body})),
        updateTransferData: (payload) => dispatch(updateTransferData(payload))
    }
};

class SendtoPublicIdentifier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            public_identifier: null
        };
    }

    onPress() {
        this.props.navigation.navigate('PaymentLogic')
        // this.props.createTransferRequest({
        //     'public_identifier': this.props.transferData.public_identifier,
        //     'transfer_amount': this.props.transferData.transfer_amount,
        //     'is_sending': true
        // });
    }


    render() {

        return(
            <View>

                <TextInput
                    onChangeText={(public_identifier) => this.props.updateTransferData({public_identifier})}
                    placeholder={strings('SendPayment.Prompt')}
                    value={this.state.vendor_pin}
                />

                {/*<Text style={{marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center', color: 'red'}}>*/}
                    {/*{error_message}*/}
                {/*</Text>*/}

                <AsyncButton onPress={() => this.onPress()} isLoading={false} buttonText={strings('SendPayment.SendButton')}/>

            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SendtoPublicIdentifier);

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        padding: 10,
        textAlign: 'center',
    },
    chargeButton: {
        padding: 10,
        backgroundColor: '#F2F4F5',
        borderColor: '#C2C7CC',
        borderWidth: 0.5,
        justifyContent: 'center',
    },
    chargeButtonText: {
        color: '#2D9EA0',
        fontSize: 24,
        textAlign: 'center'
    },
});