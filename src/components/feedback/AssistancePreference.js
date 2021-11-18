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

export default class AssistancePreference extends Component {

    render() {
        const { height, width } = Dimensions.get('window');

        return(
            <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'column'}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating("assistance_delivery_preference", 1, "cash")}>
                        <View style={styles.deliveryPreference}>
                            <FeedbackIcon name={'cash'} size={60} color="#2D9EA0"
                                          backgroundColor="#FFF"/>
                            <Text style={styles.feedbackText}>{strings('SurveyFeedback.cash')}</Text>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating("assistance_delivery_preference", 1, "goods")}>
                        <View style={styles.deliveryPreference}>
                            <FeedbackIcon name={'basket'} size={60} color="#2D9EA0"
                                          backgroundColor="#FFF"/>
                            <Text style={styles.feedbackText}>{strings('SurveyFeedback.goods')}</Text>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating("assistance_delivery_preference", 1, "services")}>
                        <View style={styles.deliveryPreference}>
                            <FeedbackIcon name={'account-group'} size={60} color="#2D9EA0"
                                          backgroundColor="#FFF"/>
                            <Text style={styles.feedbackText}>{strings('SurveyFeedback.services')}</Text>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating("assistance_delivery_preference", 1, "mix")}>
                        <View style={styles.deliveryPreference}>
                            <FeedbackIcon name={'account-details'} size={60} color="#2D9EA0"
                                          backgroundColor="#FFF"/>
                            <Text style={styles.feedbackText}>{strings('SurveyFeedback.mix')}</Text>
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