import * as React from 'react';
import {ScrollView, View, Text, StyleSheet, Alert, TouchableNativeFeedback, Button} from 'react-native';
import Modal from "react-native-modal";
import {tracker} from "../analytics";
import {strings} from "../../locales/i18n";
import RNRestart from "react-native-restart";
import {localeRequest} from "../reducers/localeReducer";
import {connect} from "react-redux";
// import Button from "./Button";
import Styles from '../Styles.js'
import { RadioButton } from "./RadioButton";

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        localeRequest: (payload) => dispatch(localeRequest(payload)),
    }
};

class LanguageModal extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            checked: '',
        }
    }

    componentDidMount() {
        this.setState({checked: this.props.locale.locale})
    }

    changeLanguage() {
        console.log("chanigng lang")
        if (this.props.locale.locale !== this.state.checked) {
            tracker.logEvent("ChangeLanguage");
            this.props.close();
            this.props.localeRequest(this.state.checked);
            Alert.alert(
                strings('LocaleAlert.Title'),
                strings('LocaleAlert.Details'),
                [
                    {text: 'OK', onPress: () => RNRestart.Restart()},
                ],
                {cancelable: false}
            );
        }
        this.props.close()
    }

    _renderButton(button, i) {
        return(
            <TouchableNativeFeedback key={i} background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.setState({ checked: button.action })}>
                <View style={styles.row}>
                    <View pointerEvents="none">
                        <RadioButton selected={this.state.checked === button.action} />
                    </View>
                    <Text style={styles.text}>{button.locale}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }

    render() {
        const { visible, close } = this.props;

        const buttons = [
            {locale: 'English', action: 'en'},
            {locale: 'عربى', action: 'ar'},
            {locale: 'Français', action: 'fr'},
            {locale: 'Español', action: 'es'},
            {locale: 'Bislama', action: 'bi'},
        ];

        return (
            <Modal
                isVisible={visible}
                onBackdropPress={close}
                onBackButtonPress={close}
                onSwipeComplete={close}
                swipeThreshold={200}
                swipeDirection="down"
                useNativeDriver={true}
            >
                <View style={styles.modalContent}>
                    <View style={{paddingHorizontal: 16, alignItems: 'flex-start'}}>
                        <Text style={Styles.title}>{strings('LocaleAlert.LanguageTitle')}</Text>
                    </View>
                    <View style={{ width: '100%', display: 'flex', borderColor: '#D8D9DD', borderBottomWidth: 1, borderTopWidth: 1 }}>
                        {buttons.map((button, i) => this._renderButton(button, i))}
                    </View>
                    <View style={{display: 'flex', alignItems: 'flex-end', padding: 16}}>
                        <Button
                            color='#34b0b3'
                            title={strings('LocaleAlert.Button')}
                            onPress={() => this.changeLanguage()}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LanguageModal);


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    text: {
        paddingLeft: 8,
        paddingRight: 8,
    },
    modalContent: {
        display: 'flex',
        width: '100%',
        backgroundColor: "white",
        justifyContent: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        zIndex: 99,
    },
});