import React, { Component } from 'react';
import { Image, Animated, StyleSheet , View, Button, Text} from 'react-native';
//todo: install when pipeline fixed, see https://github.com/react-native-community/react-native-image-picker/issues/972
// import ImagePicker from 'react-native-image-picker'
import {connect} from "react-redux";
import { newImageUpload } from "../reducers/imageUploadReducer"
import {strings} from "../../locales/i18n";
import {tracker} from "../analytics";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        imageUpload: state.imageUpload,
    };
};

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
        newImageUpload: image => dispatch(newImageUpload(image, ownprops.type, ownprops.transferId))
    };
};


class ImageUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    pickImageHandler = () => {
        tracker.logEvent("ReceiptUpload");
        // ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 800, maxHeight: 600}, res => {
        //     if (res.didCancel) {
        //         console.log("User cancelled!");
        //     } else if (res.error) {
        //         console.log("Error", res.error);
        //     } else {
        //         this.props.newImageUpload(res)
        //         this.setState({
        //             pickedImage: { uri: res.uri }
        //         });
        //
        //     }
        // });
    };

    render() {

        const children = React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                onPress: () => this.pickImageHandler(),
                isLoading: false,
            });
        });

        if (this.props.imageUpload.success) {
            var messageText = strings('ReceiptUpload.Success')
        } else if (this.props.imageUpload.isRequesting) {
            messageText = strings('ReceiptUpload.Loading')
        } else {
            messageText = ''
        }

        return (
            <View style={styles.container}>
                { children }

                {/*<AsyncButton onPress={() => this.pickImageHandler()} isLoading={false} buttonText={strings('ReceiptUpload.UploadReceiptButton')}/>*/}
                {/*<Text> {messageText} </Text>*/}
            </View>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader);


const styles = StyleSheet.create({
    container: {
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
});