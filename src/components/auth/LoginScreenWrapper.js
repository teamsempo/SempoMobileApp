import React from 'react';
import {connect} from "react-redux";
import { StyleSheet, Text, View, KeyboardAvoidingView, Image } from 'react-native';
import { TextInput as FlatTextInput }  from 'react-native-paper';

import { strings } from '../../../locales/i18n';
import LanguageModal from '../LanguageModal'


const mapStateToProps = (state) => {
    return {
        locale: state.locale,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class LoginScreenWrapper extends React.Component {
    state = {
        isLanguageModalVisible: false,
    };

    toggleModal(visible) {
        this.setState({isLanguageModalVisible: visible});
    }


    render() {

        return (
            <KeyboardAvoidingView style={styles.rootContainer}>
                <View style={styles.topContainer}>
                    <Image
                        source={require('../img/sempo_logo.png')}
                        style={{width: 224, height: 92}}
                    />
                </View>

                <KeyboardAvoidingView behavior='padding' style={styles.bottomContainer}>
                    { this.props.children }
                </KeyboardAvoidingView>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.termsText}
                          onPress={() => this.props.navigation.navigate('Terms', { title: strings('LoginScreen.Legal')})}>{strings('LoginScreen.Legal')}</Text>
                    <Text style={styles.termsText}
                          onPress={() => this.toggleModal(true)}>{strings('LocaleAlert.LanguageTitle')}</Text>
                </View>

                <LanguageModal visible={this.state.isLanguageModalVisible} close={() => this.toggleModal(false)} />

            </KeyboardAvoidingView>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreenWrapper);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    topContainer: {
        flex: 4,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 8,
        backgroundColor: '#FFF',
        margin: 20,
    },
    termsText: {
        fontSize: 12,
        padding: 20,
        textAlign: 'center',
    },
});
