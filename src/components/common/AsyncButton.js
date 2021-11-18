import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, TouchableHighlight } from 'react-native';
import {strings} from "../../../locales/i18n";

export default class AsyncButton extends React.Component {
    constructor() {
        super();
    }

    render() {

        if (this.props.isLoading) {
            return(
                <View>
                    <View>
                        <TouchableHighlight underlayColor='#34b0b3' style={styles.submitButton} onPress={this.props.onPress} accessibilityLabel={strings('ReceiptUpload.Loading')}>
                            <Text style={styles.chargeButtonText}>{this.props.buttonText}</Text>
                        </TouchableHighlight>
                    </View>
                    <Modal
                        transparent={true}
                        animationType={'none'}
                        onRequestClose={() => {console.log('close modal')}}>
                        <View style={styles.modalBackground}>
                            <View style={styles.activityIndicatorWrapper}>
                                <ActivityIndicator />
                            </View>
                        </View>
                    </Modal>
                </View>
            )
        } else if (this.props.isSuccess) {
            return(
                <View style={styles.submitButton} onClick={() => null} accessibilityLabel={strings('SendPaymentCameraScreen.Success')}>
                    <Text style={styles.chargeButtonText}>
                        {strings('SendPaymentCameraScreen.Success')}
                    </Text>
                </View>
            )
        }
        return(
            <View>
                <TouchableHighlight underlayColor='#34b0b3' style={styles.submitButton} onPress={this.props.onPress} accessibilityLabel={this.props.buttonText}>
                    <Text style={styles.chargeButtonText}>{this.props.buttonText}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    chargeButtonText: {
        color: '#FFF',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 1,
    },
    submitButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 24,
        paddingRight: 24,
        borderWidth: 0,
        margin: 5,
        backgroundColor: '#2D9EA0',
        borderRadius: 6,
    }
});