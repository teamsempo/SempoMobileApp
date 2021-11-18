import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableNativeFeedback,
    TouchableHighlight
} from 'react-native';

import Styles from '../Styles';

export default class InputButton extends Component {

    render() {
        const { value } = this.props;
        const label = typeof value === "number" ? value + '' : null;
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
                underlayColor="#F2F4F5"
                onPress={this.props.onPress}
                accessibilityLabel={label}>
                <View style={Styles.inputButton}>
                    <Text style={Styles.inputButtonText}>{this.props.value}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }

}