import React from 'react'
import { View } from 'react-native'

import Styles from '../Styles';
import InputButton from './InputButton';
import {getToken} from "../utils";

// const inputButtons = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//     ['C', 0, '']
// ];

export default class Keypad extends React.Component {


    // componentDidMount() {
    //     const makeRequest = async () => {
    //         console.log('get token returns: ', await getToken());
    //         console.log('resolved');
    //         return "done"
    //     };
    //
    //     console.log('make request returns:');
    //
    //     makeRequest().then(res => console.log(res))
    //
    // }

    // async componentDidMount() {
    //     var AsyncVal = await AsyncStorage.getItem('userToken');
    //     await this.setState({ usertoken: AsyncVal });
    //     console.log("ControllerXXX/componentDidMount : state.usertoken" + this.state.usertoken + "; AsyncVal=" + AsyncVal );
    // }

    constructor(props) {
        super(props);

        this.state = {
            selectedSymbol: null,
        }
    }

    static defaultProps = {
        inputButtons: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            ['C', 0, '']
        ]
    };

    _renderInputButtons() {

        const inputButtons = this.props.inputButtons;

        let views = [];

        for (let r = 0; r < inputButtons.length; r ++) {
            let row = inputButtons[r];

            let inputRow = [];
            for (let i = 0; i < row.length; i ++) {
                let input_data = row[i];

                switch (typeof input_data) {
                    case 'number':
                        var input_value = input_data;
                        var input_display = input_data;
                        break;
                    case 'string':
                        input_value = input_data;
                        input_display = input_data;
                        break;
                    case 'object':
                        input_value = input_data.value;
                        input_display = input_data.display;
                }

                inputRow.push(
                    <InputButton
                        value={input_display}
                        onPress={this._onInputButtonPressed.bind(this, input_value)}
                        key={r + "-" + i}/>
                );
            }

            views.push(<View style={Styles.inputRow} key={"row-" + r}>{inputRow}</View>)
        }

        return views;
    }

    _onInputButtonPressed(input) {
        switch (typeof input) {
            case 'number':
                return this._handleNumberInput(input);
            case 'string':
                return this._handleStringInput(input)
        }
    }

    _handleNumberInput(num) {
        //CalcValue is in cents

        let calcValue = this.props.value.toString() + num.toString()

        console.log('new_value_is', calcValue)


        if (parseInt(calcValue) > 10**10) {
            calcValue = 0
        }

        this.props.onChange(calcValue)
    }

    _handleNumberBackspace() {
            let calcValue = this.props.value.toString().slice(0, -1)

            this.props.onChange(calcValue)
    }


    _handleStringInput(str) {
        switch (str) {
            case 'C': //Clear the input
                this.props.onChange(0);
                break;
            case 'B': //Backspace the input
                this._handleNumberBackspace();
                break;
            case 'S': //Submit the input
                this.props.onSubmit();
                break;
            default:
                break
        }
    }

    render() {
        return (
            <View style={Styles.inputContainer}>
                {this._renderInputButtons()}
            </View>
        )
    }
}
