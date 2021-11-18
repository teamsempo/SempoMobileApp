'use strict';
import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    TextInput
} from 'react-native';

import {strings} from "../../../locales/i18n";
import AsyncButton from "../common/AsyncButton";

export default class Referral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: null,
            last_name: null,
            phone_number: null,
            fieldMissing: false,
        }
    }

    _handleSubmit() {
        if ((this.state.first_name || this.state.last_name || this.state.phone_number) === null) {
            this.setState({fieldMissing: true});
            return
        }

        const referral = 'firstName:' + this.state.first_name + ',lastName:' + this.state.last_name + ',phoneNumber:' + this.state.phone_number;
        this.props._handleFeedbackRating("sempo_referral", 1, referral)
    }

    render() {
        const { height, width } = Dimensions.get('window');

        if (this.state.fieldMissing) {
            var error_message = strings("Referral.error_message")
        } else {
            error_message = null;
        }

        return(
            <View style={{height: height, flex: 1}}>
                <ScrollView contentContainerStyle={{width: width, height: (height * 0.75), justifyContent: 'space-between', padding: (width * 0.05)}}>
                    <Text>{strings('Referral.description')}</Text>

                    <TextInput
                        onChangeText={(first_name) => this.setState({first_name})}
                        placeholder={strings('Referral.first_name')}
                        maxLength={15}
                        value={this.state.first_name}
                        style={{ borderBottomWidth: 1, textAlign: (this.props.locale.isRTL ? 'right' : 'left')}}
                    />

                    <TextInput
                        onChangeText={(last_name) => this.setState({last_name})}
                        placeholder={strings('Referral.last_name')}
                        maxLength={15}
                        value={this.state.last_name}
                        style={{ borderBottomWidth: 1, textAlign: (this.props.locale.isRTL ? 'right' : 'left')}}
                    />

                    <TextInput
                        keyboardType="phone-pad"
                        onChangeText={(phone_number) => this.setState({phone_number})}
                        placeholder={strings('Referral.phone_number')}
                        maxLength={15}
                        value={this.state.phone_number}
                        style={{ borderBottomWidth: 1, textAlign: (this.props.locale.isRTL ? 'right' : 'left')}}
                    />

                    <Text style={{marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center', color: 'red'}}>
                        {error_message}
                    </Text>

                    <AsyncButton onPress={() => this._handleSubmit()} isLoading={this.props.isSubmitting} buttonText={strings('Referral.Submit')}/>
                </ScrollView>
            </View>
        )
    }
}