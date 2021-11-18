import React from 'react'
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Modal,
    Text
} from 'react-native'

export default class LoadingSpinnerOverlay extends React.Component {

    static defaultProps = {
        loading: false,
    };

    render() {
        return (
            <View style={{zIndex: 99}}>
                <Modal
                    visible={this.props.loading}
                    transparent={true}
                    animationType={'none'}
                    onRequestClose={() => {console.log('close modal')}}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
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
});