import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, Image } from 'react-native';

class AsyncImage extends Component {

    constructor(props: Props) {
        super(props);
        this.state = { loaded: false }
    }

    _onLoad = () => {
        this.setState(() => ({ loaded: true }))
    };

    render() {
        const {
            style,
            source
        } = this.props;

        return (
            <View>

                <Image source={source} style={style} onLoad={this._onLoad} />
                {
                    !this.state.loaded &&
                    <ActivityIndicator style={style}
                        style=
                            {[
                                style,
                                {
                                    position: 'absolute'
                                }
                            ]}
                    />
                }

            </View>
        )
    }
}

export default AsyncImage