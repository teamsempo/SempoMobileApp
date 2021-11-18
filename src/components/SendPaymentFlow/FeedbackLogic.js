'use strict';
import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';

import { newFeedback } from '../../reducers/feedbackReducer'

import {connect} from "react-redux";
import { strings } from '../../../locales/i18n';
import FeedbackIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        newFeedbackData: state.newFeedbackData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        newFeedback: (payload) => dispatch(newFeedback(payload))
    };
};

class FeedbackLogic extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        var collectionReason = this.props.getFeedback ? 'transfer_feedback' : this.props.checkBalanceFeedback ? 'checkbalance_feedback' : null;

        // FEEDBACK MODAL CONTENTS & LOGIC
        if (this.props.newFeedbackData.isRequesting === true) {
            var title = strings('SendPaymentCameraScreen.Sending');

            var content = <ActivityIndicator size="large" />;

            var buttons = null;

        } else if (this.props.newFeedbackData.success === true) {
            title = strings('SendPaymentCameraScreen.FeedbackSent');

            content = <FeedbackIcon name={'check-circle-outline'} size={100} color="#2D9EA0"
                            backgroundColor="#FFF"/>;

            buttons =
                <View style={{flexDirection: 'row', padding: 10, paddingTop: 0}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                        <View style={[styles.payContainer, {justifyContent: 'center', marginTop: 0}]}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFF'}}>{strings('SendPaymentCameraScreen.Done')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>

        } else if (this.props.newFeedbackData.error !== null) {
            title = (this.props.newFeedbackData.error === null ? 'Unknown Error' : this.props.newFeedbackData.error);

            content = <FeedbackIcon name={'close-circle-outline'} size={100} color="#D0021B"
                            backgroundColor="#FFF"/>;
            buttons =
                <View style={{flexDirection: 'row'}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                        <View style={{justifyContent: 'center', paddingBottom: 20, paddingTop: 5, flex: 1}}>
                            <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Ok')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>

        }  else if (this.props.getAdditionalFeedback === true) {
            title = 'Additional Information';
            content =
                <KeyboardAvoidingView style={{flex: 1, width: '100%', justifyContent: 'center', padding: 20}}>
                    <TextInput
                        style={{height: '100%', backgroundColor: '#F5F5F5', borderRadius: 5, textAlignVertical: "top", padding: 12}}
                        placeholder={strings('SendPaymentCameraScreen.TextInputPlaceholder')}
                        placeholderTextColor={'#9B9B9B'}
                        multiline = {true}
                        numberOfLines = {4}
                        maxLength={500}
                        onChangeText={(additional_information) => this.props._handleAdditionalInformation(additional_information)}
                        value={this.props.additional_information}
                    />
                </KeyboardAvoidingView>;
            buttons =
                <View style={{flexDirection: 'row', padding: 10, paddingTop: 0}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._sendFeedback(collectionReason)}>
                        <View style={[styles.payContainer, {justifyContent: 'center', marginTop: 0}]}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFF'}}>{strings('SendPaymentCameraScreen.Submit')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
        } else if (this.props.getFeedback === true || this.props.checkBalanceFeedback === true) {

            title = strings('SendPaymentCameraScreen.FeedbackTitle');
            content =
                <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating(collectionReason, 1)}>
                            <View style={{justifyContent: 'center', padding: 25, alignItems: 'center', flex: 1}}>
                                <FeedbackIcon name={'emoticon-happy-outline'} size={80} color="#2D9EA0"
                                              backgroundColor="#FFF"/>
                                <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Good')}</Text>
                            </View>
                        </TouchableNativeFeedback>

                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._handleFeedbackRating(collectionReason, -1)}>
                            <View style={{justifyContent: 'center', padding: 25, alignItems: 'center', flex: 1}}>
                                <FeedbackIcon name={'emoticon-sad-outline'} size={80} color="#D0021B"
                                              backgroundColor="#FFF"/>
                                <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.HadIssues')}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>;
            buttons =
                <View style={{flexDirection: 'row'}}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.props._resetModal()}>
                        <View style={{justifyContent: 'center', paddingBottom: 20, paddingTop: 5, flex: 1}}>
                            <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Skip')}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>

        } else {
            title = '';
            content = null;
            buttons = null;
        }

        // FEEDBACK MODAL
        return (
          <View style={[styles.feedbackWrapper]}>
            <Text style={[styles.title]}>
              {title}
            </Text>
            <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              {content}
            </View>
            {buttons}
          </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FeedbackLogic);

const styles = StyleSheet.create({
    title: {
        color: '#4A4A4A',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderColor: '#F7F7F7'
    },
    amountText: {
        color: '#4A4A4A',
        fontSize: 40,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingBottom: 10,
    },
    vendorText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#4A4A4A',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
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
    feedbackWrapper: {
        height: '100%',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    paymentModalWrapper: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#FFFFFF',
        height: Dimensions.get('window').height * 0.52,
        borderRadius: 10,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        alignItems: 'center',
    },
    payContainer: {
        flex: 1,
        backgroundColor: '#2D9EA0',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        height: 55,
        margin: 10,
    },
    feedbackText: {
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        color: '#9B9B9B'
    }
});