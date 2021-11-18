import React, {Component} from 'react'
import { StyleSheet, View} from 'react-native'

import NavBar from "../nav/NavBar";

import QrCodeGenerator from './QrCodeGenerator'
import QrCodeBorder from './QrCodeBorder'


import {connect} from "react-redux";


const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class MakePaymentScreen extends React.Component {
    constructor(props) {
        super(props);

    }



    render() {

        return (
            <View style={styles.container}>
                <NavBar navigation={this.props.navigation} title={'Make Payment'} />

                <View style={styles.qrContainer}>
                    <QrCodeGenerator duration={5000} qrCodeSize={200}/>
                </View>

            </View>
        );

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MakePaymentScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    qrContainer: {
        padding: 50
    }
});