import React from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import { WebView } from 'react-native-webview';

import {connect} from "react-redux";
import {strings} from "../../../locales/i18n";

const mapStateToProps = (state) => {
    return {
        networkStatus: state.networkStatus.isConnected,
    };
};

class FAQScreen extends React.Component<any, any> {
    _renderError = () => {
        return(
            <Text style={{fontSize: 40}}>Something went wrong.</Text>
        )
    };

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.bottomContainer}>
                    {this.props.networkStatus
                        ? <WebView source={{uri: strings('ExternalLinks.Help')}} renderError={() => this._renderError()}/>
                        : <Text>{strings('OfflineNotice.Message')}</Text>
                    }
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps, null)(FAQScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    bottomContainer: {
        flex: 11,
    }
});