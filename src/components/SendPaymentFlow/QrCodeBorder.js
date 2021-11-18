import {Animated} from "react-native";
import QrCodeGenerator from './QrCodeGenerator'
import React from "react";

class QrCodeBorder extends React.Component {
    state = {
        fillAnim: new Animated.Value(0),  // Initial value for fill: 0
    };

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fillAnim,            // The animated value to drive
            {
                toValue: this.props.qrCodeSize + 10,                   // Animate to opacity: 1 (opaque)
                duration: this.props.duration,              // Make it take a while
            }
        ).start();                        // Starts the animation
    }

    render() {
        let { fillAnim } = this.state;

        return (
            <Animated.View                 // Special animatable View
                style={{
                    ...this.props.style,
                    height: fillAnim,
                    width: this.props.qrCodeSize + 10,
                }}
            >
            </Animated.View>
        );
    }
}

// You can then use your `FillUpView` in place of a `View` in your components:
export default QrCodeBorder