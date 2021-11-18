import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

export default class Button extends React.Component {
    constructor() {
        super();
    }

    render() {
        let { outline } = this.props;
        return(
            <View>
                <TouchableHighlight underlayColor='#34b0b3' style={[styles.submitButton, {backgroundColor: outline ? 'transparent' : '#2D9EA0', borderWidth: outline ? 2 : 0, borderColor: outline ? '#2D9EA0' : null}]} onPress={this.props.onPress} accessibilityLabel={this.props.buttonText}>
                    <Text style={[styles.chargeButtonText, {color: outline ? '#2D9EA0' : '#FFF'}]}>{this.props.buttonText.toUpperCase()}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

Button.defaultProps = {
    outline: false,
};

const styles = StyleSheet.create({
    chargeButtonText: {
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
        borderRadius: 2,
    }
});