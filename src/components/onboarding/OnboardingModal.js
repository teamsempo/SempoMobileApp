'use strict';
import React, { Component } from 'react';
import {
    View,
    // Modal,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    Dimensions,
} from 'react-native';
import Modal from "react-native-modal";
import Screens from "./Screens.js";

export default class OnboardingModal extends Component {
    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                onBackdropPress={() => this.props._resetModal()}
                style={{margin: 0}}
                useNativeDriver={true}
            >
                <Screens sendToApp={this.props._resetModal}/>
            </Modal>
        )
    }
}
