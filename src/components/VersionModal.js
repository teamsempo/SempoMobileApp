import React from 'react'
import {StyleSheet, Text, View, Image, Linking, ScrollView, TouchableHighlight} from 'react-native'

import Modal from "react-native-modal";

import {connect} from "react-redux";

import Styles from '../Styles.js'
import {strings} from "../../locales/i18n";

import {tracker} from "../analytics";
import Button from "./Button";
import UpdateDrawing from "../img/UpdateDrawing";
import { dismissVersionModal } from "../actions/versionActions";

const mapStateToProps = (state) => {
    return {
        version: state.version,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dismissVersionModal: () => dispatch(dismissVersionModal()),
    }
};

class VersionModal extends React.Component {
    state = {
        isModalVisible: true
    };

    componentDidMount() {
        Linking.addEventListener('url');
    }

    componentWillUnmount() {
        Linking.removeEventListener('url');
    };


    _handleUpdateButton() {
        tracker.logEvent("UpdateVersionButton");
        Linking.openURL('https://play.google.com/store/apps/details?id=com.sempo').catch(err => console.error('An error occurred', err));
    }

    dismissModal() {
        this.setState({isModalVisible: false});
        this.props.dismissVersionModal()
    }

    render() {
        const version = this.props.version.versionDetails;

        if (!version.dismissed && version.action === 'recommend') {
            // not previously dismissed, show recommend update modal
            return(
                <View style={styles.container}>
                    <Modal
                        isVisible={this.state.isModalVisible}
                        onBackdropPress={() => this.dismissModal()}
                        onBackButtonPress={() => this.dismissModal()}
                        onSwipeComplete={() => this.dismissModal()}
                        swipeThreshold={200}
                        swipeDirection="down"
                        useNativeDriver={true}
                    >
                        <View style={styles.modalContent}>
                            <UpdateDrawing/>
                            <Text style={Styles.title}>{strings('VersionModal.soon_title')}</Text>
                            <Text style={[Styles.text, {textAlign: 'center', paddingTop: 0}]}>{strings('VersionModal.soon_message')}</Text>
                            <Button onPress={() => this._handleUpdateButton()} buttonText={strings('VersionModal.button')}/>
                        </View>
                    </Modal>
                </View>
            )
        }

        if (version.action === 'force') {
            // force update modal
            return(
                <View style={styles.container}>
                    <Modal
                        isVisible={this.state.isModalVisible}
                        onBackdropPress={() => this._handleUpdateButton()}
                    >
                        <View style={styles.modalContent}>
                            <UpdateDrawing/>
                            <Text style={Styles.title}>{strings('VersionModal.now_title')}</Text>
                            <Text style={[Styles.text, {textAlign: 'center', paddingTop: 0}]}>{strings('VersionModal.now_message')}</Text>
                            <Button onPress={() => this._handleUpdateButton()} buttonText={strings('VersionModal.button')}/>
                        </View>
                    </Modal>
                </View>
            )
        }

        // default no modal
        return null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VersionModal);

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        zIndex: 99,
    },
});