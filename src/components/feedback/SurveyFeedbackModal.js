'use strict';
import React, { Component } from 'react';
import {
    View,
    Modal,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    Dimensions,
} from 'react-native';

import {connect} from "react-redux";
import {strings} from "../../../locales/i18n";
import {newFeedback} from "../../reducers/feedbackReducer";

import Referral from "./Referral";
import AssistancePreference from "./AssistancePreference";
import AssistanceSatisfaction from "./AssistanceSatisfaction";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        locale: state.locale,
        newFeedbackData: state.newFeedbackData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        newFeedback: (payload) => dispatch(newFeedback(payload))
    };
};

class SurveyFeedbackModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            increment: 1,
            feedbackQuestions: null,
            completeFeedbackQuestions: null,
        }
    }

    componentDidMount() {
        if (this.props.requestFeedback) {
            var questions = this.props.login.requestFeedbackQuestions;
            this.setState({feedbackQuestions: questions, completeFeedbackQuestions: questions})
        } else {
            questions = this.props.login.defaultFeedbackQuestions;
            this.setState({feedbackQuestions: questions, completeFeedbackQuestions: questions});
        }
    }

    _removeFromSurveyQuestions(question_query) {
        let array = [...this.state.feedbackQuestions];
        array.splice(array.indexOf(question_query), 1);
        this.setState({feedbackQuestions: array});
    }

    _incrementProgressBar() {
        if (this.state.completeFeedbackQuestions.length === this.state.increment) {
            this.setState({feedbackQuestions: null, increment: 1});
            this.props._resetModal()
        }
        this.setState({increment: this.state.increment + 1})
    }

    _nextFeedbackItem(question_query, skip) {
        if (skip) {
            this.props.newFeedback({'question': question_query, 'rating': 0, 'additional_information': 'skipped'});
        }
        this._removeFromSurveyQuestions(question_query);
        this._incrementProgressBar();
    }

    _handleFeedbackRating(question, rating, additional_information) {
        this.props.newFeedback({'question': question, 'rating': rating, 'additional_information': additional_information});
        this._nextFeedbackItem(question, false);
    }

    render() {
        const { height, width } = Dimensions.get('window');

        if (this.state.feedbackQuestions === null) {
            return(
                <View/>
            )
        }

        if (this.state.feedbackQuestions.indexOf("assistance_satisfaction") === 0) {
            var question_query = "assistance_satisfaction";
            var question = strings('SurveyFeedback.assistance_satisfaction');
            var question_answer_content =
                <AssistanceSatisfaction
                    _handleFeedbackRating={(question, rating, additional_information) => this._handleFeedbackRating(question, rating, additional_information)}
                />

        } else if (this.state.feedbackQuestions.indexOf("assistance_delivery_preference") === 0) {
            question_query = "assistance_delivery_preference";
            question = strings('SurveyFeedback.assistance_delivery_preference');
            question_answer_content =
                <AssistancePreference
                    _handleFeedbackRating={(question, rating, additional_information) => this._handleFeedbackRating(question, rating, additional_information)}
                />

        } else if (this.state.feedbackQuestions.indexOf("nps") === 0) {
            question_query = "nps";
            question = strings('SurveyFeedback.nps');
            question_answer_content = null;

        }  else if (this.state.feedbackQuestions.indexOf("sempo_referral") === 0) {
            question_query = "sempo_referral";
            question = strings('SurveyFeedback.sempo_referral');
            question_answer_content =
                <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Referral
                        _handleFeedbackRating={(question, rating, additional_information) => this._handleFeedbackRating(question, rating, additional_information)}
                        isSubmitting={this.props.newFeedbackData.isRequesting}
                        locale={this.props.locale}
                    />
                </View>

        } else {
            question_query = null;
            question = '';
            question_answer_content = null;
        }


        // FEEDBACK MODAL
        if (this.props.modalVisible) {
            return (
                <Modal
                    transparent={true}
                    animationType={'slide'}
                    onRequestClose={() => this.props._resetModal()}>

                    <View style={styles.feedbackContentWrapper}>
                        <View style={styles.progressWrapper}>
                            <Text>{this.state.increment} OF {this.state.completeFeedbackQuestions.length}</Text>
                        </View>
                        <View style={{flexDirection: 'row', position: 'absolute', top: 0, right: 0, width: '30%'}}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this._nextFeedbackItem(question_query, true)}>
                                <View style={{justifyContent: 'center', flex: 1, padding: 28, alignItems: 'flex-end'}}>
                                    <Text style={styles.feedbackText}>{strings('SendPaymentCameraScreen.Skip')}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={styles.questionWrapper}>
                            <Text style={styles.title}>{question}</Text>
                            {question_answer_content}
                        </View>
                    </View>

                </Modal>
            )
        } else {
            return(
                <View/>
            )
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveyFeedbackModal);

const styles = StyleSheet.create({
    progressWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    questionWrapper: {
        flex: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    title: {
        width: '100%',
        color: '#4A4A4A',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
    },
    feedbackContentWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
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
