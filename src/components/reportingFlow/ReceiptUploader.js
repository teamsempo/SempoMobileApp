import React, { Component } from 'react';
import {
    Image,
    Animated,
    StyleSheet,
    View,
    Button,
    Text,
    ActivityIndicator,
    Dimensions,
    TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageUploader from "../ImageUploader.js"
import {connect} from "react-redux";

import {strings} from "../../../locales/i18n";

import UploadedImageThumbnails from "./UploadedImagesThumbnails"
import AsyncButton from "../common/AsyncButton"

const mapStateToProps = (state) => {
    return {
        imageUploadRequesting: state.imageUpload.isRequesting
    };
};

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
    };
};


class ReceiptUploader extends Component {

    static defaultProps = {
        images: [],
    };

    render() {

        var image_requesting_spinner = (
            <ImageUploader transferId={this.props.transferId}>
                <TouchableHighlight underlayColor='#34b0b3'>
                    <View style={styles.add_image}>
                        <ActivityIndicator/>
                    </View>
                </TouchableHighlight>
            </ImageUploader>
        );

        if (this.props.images.length === 0) {
            var innnercontent = (
                <View style={styles.inner_container}>
                    {(this.props.imageUploadRequesting) ?
                        image_requesting_spinner
                        :
                        <ImageUploader transferId={this.props.transferId}>
                            <TouchableHighlight underlayColor='#34b0b3'>
                                <View style={styles.stretch_add_image}>
                                    <Icon name={'camera'} size={25} color="#2D9EA0"/>
                                    <Text>
                                        {strings('ReceiptUpload.UploadReceiptButton')}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </ImageUploader>
                    }
                </View>
            )
        } else {
            innnercontent = (
                <View style={styles.inner_container}>
                    <UploadedImageThumbnails images={this.props.images}>
                        {(this.props.imageUploadRequesting) ?
                            image_requesting_spinner
                            :
                            <ImageUploader transferId={this.props.transferId}>
                                <TouchableHighlight underlayColor='#34b0b3'>
                                    <View style={styles.add_image}>
                                        <Icon name={'camera'} size={25} color="#2D9EA0"/>
                                    </View>
                                </TouchableHighlight>
                            </ImageUploader>
                        }
                    </UploadedImageThumbnails>
                </View>
            )
        }

        return (
            <View style={styles.outer_container}>
                <Text style={{paddingBottom: 20}}>
                    Uploaded Receipt Photos:
                </Text>
                {innnercontent}
            </View>
        );


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ReceiptUploader);


const styles = StyleSheet.create({
    outer_container: {
        display: 'flex',
        flexDirection: 'column',
        width: Dimensions.get('window').width
    },
    inner_container: {
        display: 'flex',
        flexDirection: 'row'
    },
    add_image: {
        width: 60,
        height: 60,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d6d7da',
        borderRadius: 0.5,
        borderStyle: 'dashed'
    },
    stretch_add_image: {
        height: 60,
        margin: 2,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d6d7da',
        borderRadius: 0.5,
        borderStyle: 'dashed'
    }
});