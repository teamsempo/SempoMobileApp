import React from 'react';
import {connect} from "react-redux";
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import { strings } from '../../locales/i18n';
import { loadUser } from '../reducers/userReducer'
import { setNetworkStatus } from "../reducers/networkStatusReducer";
import { REAUTH_REQUEST } from '../reducers/authReducer'

const mapStateToProps = (state) => {
    return {
        login: state.login,
        locale: state.locale,
        networkStatus: state.networkStatus,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setNetworkStatus: (payload) => dispatch(setNetworkStatus(payload)),
        loadUser: (payload) => dispatch(loadUser(payload)),
        reAuth: () => dispatch({type: REAUTH_REQUEST})
    };
};

class OfflineNotice extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            unsubscribe: null
        };
    }

    componentDidMount() {

        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection state", state);
            this.handleConnectivityChange(state.isConnected)
        });

        this.setState({unsubscribe: unsubscribe});
    }

    componentWillUnmount() {
        if (this.state.unsubscribe) {
            this.state.unsubscribe()
        }
    }

    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.props.setNetworkStatus(isConnected);
        } else {
            this.props.setNetworkStatus(isConnected);
        }
    };

    render() {
        if (!this.props.networkStatus.isConnected && this.props.locale.locale) {
            return (
                <View style={styles.offlineContainer}>
                    <Text style={styles.offlineText}>{strings('OfflineNotice.Message')}</Text>
                </View>
            );
        }
        return null;
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OfflineNotice);


const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    offlineText: { color: '#fff', fontSize: 12}
});