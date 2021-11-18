'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    Dimensions,
} from 'react-native';

import {strings} from "../../../locales/i18n";
import FeedbackIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AssistanceSatisfaction extends Component {

    render() {
        const { height, width } = Dimensions.get('window');

        return(
            <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating("assistance_satisfaction", 1, null)}>
                        <View style={{justifyContent: 'center', padding: 25, alignItems: 'center', flex: 1}}>
                            <FeedbackIcon name={'emoticon-happy-outline'} size={80} color="#2D9EA0"
                                          backgroundColor="#FFF"/>
                            <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Good')}</Text>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating("assistance_satisfaction", -1, null)}>
                        <View style={{justifyContent: 'center', padding: 25, alignItems: 'center', flex: 1}}>
                            <FeedbackIcon name={'emoticon-sad-outline'} size={80} color="#D0021B"
                                          backgroundColor="#FFF"/>
                            <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.HadIssues')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    feedbackText: {
    },
    deliveryPreference: {
        justifyContent: 'space-between',
        padding: 25,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.8,
    }
});