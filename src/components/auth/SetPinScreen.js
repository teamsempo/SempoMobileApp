import React from 'react'
import {connect} from "react-redux";

import { setPinRequest } from "../../reducers/authReducer";
import { strings } from "../../../locales/i18n";
import GenericPinComponent from "./GenericPinComponent"

const mapStateToProps = (state) => {
    return {
        setPin: state.setPin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPinRequest: (body) => dispatch(setPinRequest({body})),
    };
};

class SetPinScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storedPinVal: '',
            noMatch: false,
        };
    }

    submitPin(pinValue, pinComponent) {

        let storedPinVal = this.state.storedPinVal;

        if (storedPinVal === '') {
            // set the PIN in state. clear.
            pinComponent.clear();
            this.setState({storedPinVal: pinValue});

        } else if (pinValue === storedPinVal) {
            // PIN in state == PIN provided
            // set new PIN on server and device
            let params = this.props.route.params;

            this.props.setPinRequest({
                phone: params.phone,
                region: params.region,
                one_time_code: params.one_time_code,
                new_pin: pinValue,
            })

        } else {
            // PIN in state is different. clear.
            pinComponent.clear();

            this.setState({
                storedPinVal: '',
                noMatch: true
            }, () => setTimeout(() => this.setState({noMatch: false}), 4000))
        }
    }

    render() {
        const { setPin } = this.props;

        let promptText;
        if (this.state.noMatch) {
            promptText = strings('SetPin.NotMatchingError')
        } else if (setPin.error) {
            promptText = setPin.error
        } else if (this.state.storedPinVal === '') {
            promptText = strings('SetPin.ChoosePinPrompt')
        } else {
            promptText = strings('SetPin.ReenterPinPrompt')
        }
        return (
            <GenericPinComponent
                authState={setPin}
                submitPin={(pin, pinComponent) => this.submitPin(pin, pinComponent)}
                promptText={promptText}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPinScreen);
