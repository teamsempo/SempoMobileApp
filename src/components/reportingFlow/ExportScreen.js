import React from 'react'
import { StyleSheet, Text, View, Image, ActivityIndicator, StatusBar, TextInput, Linking } from 'react-native'
import {connect} from "react-redux";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { newExport, RESET_EXPORT } from "../../reducers/exportReducer";
import { strings } from '../../../locales/i18n';
import AsyncButton from '../common/AsyncButton'

const mapStateToProps = (state) => {
    return {
        login: state.login,
        locale: state.locale,
        transferAccountInfo: state.transferAccountInfo,
        newExportRequest: state.newExportRequest
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        newExport: (payload) => dispatch(newExport(payload)),
        resetExport: () => dispatch({type: RESET_EXPORT}),
    };
};


class ExportScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    componentWillUnmount() {
        this.props.resetExport()
    }

    _onPress() {
        this.props.newExport({'date_range': null, 'email': this.state.email});
    };

    render() {
        if (this.props.newExportRequest.error !== null) {
            return (
                <View style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <Icon name="close-circle-outline" size={100} color="#3D454C"/>
                        <Text style={styles.smallText}>{this.props.newExportRequest.error}</Text>
                    </View>
                </View>
            )
        } else if (this.props.newExportRequest.success === true) {
            return (
                <View style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <Icon name="check-circle-outline" size={100} color="#3D454C"/>
                        <Text style={styles.smallText} onPress={ ()=> Linking.openURL(this.props.newExportRequest.file_url) } >{strings('ExportScreen.OpenFile')}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <View style={{padding: 10}}>
                        <TextInput
                            keyboardType="email-address"
                            onChangeText={(email) => this.setState({email})}
                            placeholder={strings('ExportScreen.EmailPlaceholder')}
                            value={this.state.email}
                            style={{borderBottomWidth: 1, textAlign: (this.props.locale.isRTL ? 'right' : 'left')}}
                        />
                        {this.props.newExportRequest.error}
                        <AsyncButton onPress={() => this._onPress()} isLoading={this.props.newExportRequest.isRequesting} buttonText={strings('ExportScreen.Title')}/>
                    </View>
                </View>
            )
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainContainer: {
        flex: 11,
        backgroundColor: '#FFF',
        margin: 20,
    },
    loadingContainer: {
        flex: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    smallText: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 30,
    }
});