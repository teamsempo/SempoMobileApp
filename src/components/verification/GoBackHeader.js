import React from 'react'
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {
    StyleSheet,
} from 'react-native'

import { Appbar } from 'react-native-paper'
import {strings} from "../../../locales/i18n";

export default class GoBackHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _goBack = () => {
        if (this.props.goBack) {
            // can pass custom goBack func
            this.props.goBack();
            return
        }

        // default
        this.props.navigation.goBack()
    };

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    render() {

        return(
            <Appbar style={styles.bottom} dark={this.props.dark}>
                <Appbar.BackAction onPress={this._goBack}/>
                <Appbar.Content
                    title={strings('GoBackNav.DefaultTitleText')}
                />
            </Appbar>
        );
    }
}

GoBackHeader.defaultProps = {
    goBack: null,
    dark: false,
};

GoBackHeader.propTypes = {
    goBack: PropTypes.func,
    dark: PropTypes.bool
};

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'transparent',
        zIndex: 99,
        elevation: 0,
        shadowOpacity: 0,
    },
});

