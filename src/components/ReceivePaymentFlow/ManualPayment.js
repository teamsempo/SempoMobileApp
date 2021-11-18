import React from 'react'
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'

import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';
import { updateTransferData } from "../../reducers/creditTransferReducer";
import BottomAsyncButton from "../BottomAsyncButton.js";
import Styles from "../../Styles";

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransferData: (payload) => dispatch(updateTransferData(payload))
    };
};

class ManualPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            public_identifier: null,
            noCode: null,
        };
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    _onClick(){
        if (this.state.public_identifier === null) {
            this.setState({noCode: strings('ManualPayment.InvalidCode')});
            return
        }

        this.props.updateTransferData({
            public_identifier: this.state.public_identifier
        });
        this.props.navigation.navigate('EnterPin')
    }

    render() {
        if (this.state.noCode) {
            var error_message = this.state.noCode
        } else {
            error_message = null
        }


        return (
            <KeyboardAvoidingView style={styles.rootContainer}>
                <View style={styles.mainContainer}>
                    <TextInput
                        onChangeText={input => this.setState({public_identifier: input})}
                        placeholder={strings('PaymentsOptionScreen.Manual')}
                        keyboardType={'numeric'}
                        value={this.state.public_identifier}
                        style={[Styles.questionWrapper, {textAlign: (this.props.isRTL ? 'right' : 'left')}]}
                    />
                    <Text style={{paddingVertical: 10}}>{strings('ManualPayment.Prompt')}</Text>
                    <Text style={{marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center', color: 'red'}}>
                        {error_message}
                    </Text>
                </View>

                <BottomAsyncButton buttonText={strings('SendPaymentCameraScreen.Next').toUpperCase()} onPress={() => this._onClick()} />
            </KeyboardAvoidingView>
        )
    }
}
export default connect(null, mapDispatchToProps)(ManualPayment);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainContainer: {
        flex: 11,
        backgroundColor: '#FFF',
        marginTop: 10,
        margin: 20,
    }
});