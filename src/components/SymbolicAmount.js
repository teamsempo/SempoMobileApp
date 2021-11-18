import React, {Component} from 'react';
import {Modal, Text, TouchableOpacity, View, Alert, Dimensions, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyAmount from './CurrencyAmount.js'

export default class SymbolicAmount extends Component {


    constructor(props) {
        super(props);
        this.state = {
        }

        this.sorted_denominations =
            Object.keys(this.props.denominations)
                .map(result => result)
                .sort((a,b) => b - a)

    }


    denominate(amount, denomination_set) {

        let remaining_cash = amount*100

        let denominated = [];
        denomination_set.map(denomination => {
            let count = Math.floor(remaining_cash/(denomination*100))
            remaining_cash = remaining_cash%(denomination*100)

            // denominated[denomination] = count

            let arr = new Array(count)

            arr = arr.fill(denomination)

            denominated = denominated.concat(arr)

        });

        // denominated['remaining_cash'] = remaining_cash/100

        return denominated
    };

    render() {

        if (this.props.modalVisible) {
            let denominated_amount = this.denominate(this.props.amount, this.sorted_denominations);
            console.log('denominated_amount', denominated_amount)

            var modalContent = (
                <View style={styles.modalContentWrapper}>
                    <Text style={styles.title}>
                        <CurrencyAmount amount={this.props.amount}/>
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
                        {
                            denominated_amount.map(amount =>{
                                let amount_detail = this.props.denominations[amount]
                                return (
                                    <View style={{margin: 2}}>
                                        <Icon name="cash"
                                              size={Math.floor(40*amount_detail.size)}
                                              color={amount_detail.color}/>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            )
        } else {
            modalContent = (
                <View style={styles.modalContentWrapper}>

                </View>
            )
        }

        return (
            <View style={styles.totalWrapper}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.modalVisible}
                    onRequestClose={() => {
                        this.props.toggleModalVisible()
                    }}>
                    <View>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.modalTouchable}
                            onPressOut={() => {this.props.toggleModalVisible()}}>
                            { modalContent }
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    totalWrapper: {

    },
    title: {
        width: '100%',
        color: '#4A4A4A',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
    },
    modalContentWrapper: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ededed',
        height: Dimensions.get('window').height * 0.5,
        width: '100%',
        borderRadius: 10,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        alignItems: 'center',
    },
    modalTouchable: {
        width: '100%',
        height: '100%'

    }
});
