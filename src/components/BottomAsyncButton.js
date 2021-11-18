import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, Dimensions, TouchableHighlight } from 'react-native';
import {strings} from "../../locales/i18n";

export default class BottomAsyncButton extends React.Component {
    constructor() {
        super();
    }

    render() {
        let backgroundColor = this.props.buttonColor ? {backgroundColor: this.props.buttonColor} : null;
        let underlayColor = this.props.buttonColor ? this.props.buttonColor : '#34b0b3';

        if (this.props.isLoading) {
            return(
                <View accessibilityLabel={strings('CardScanScreen.Loading')}>
                    <View>
                        <TouchableHighlight underlayColor='#34b0b3' style={styles.submitButton} onPress={this.props.onPress}>
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
            <View style={{position: 'absolute', bottom: 0, width: Dimensions.get('window').width,}} accessibilityLabel={this.props.buttonText}>
                <TouchableHighlight underlayColor={underlayColor} style={[styles.submitButton, backgroundColor]} onPress={this.props.onPress}>
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
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '200',
    },
    submitButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 0,
        backgroundColor: '#30a4a6',
        height: 60,
    }
});