'use strict';
import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    TouchableNativeFeedback
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import { Headline, Text } from 'react-native-paper'

import { connect } from "react-redux";
import { strings } from '../../../locales/i18n';
import {updateKYCDetails} from "../../reducers/kycApplicationReducer";
import Button from "../Button";
import GoBackHeader from "./GoBackHeader";
import { addSpaceToString } from '../../utils';

const mapStateToProps = (state) => {
    return {
        kycApplication: state.kycApplication,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateKYCDetails: (payload) => dispatch(updateKYCDetails(payload)),
    };
};

class DocumentCameraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            singleImage: false,
            documentFront: true,
            isPictureTaken: false,
            uriDocumentFront: null,
            uriDocumentBack: null,
        }
    }

    componentDidMount() {
        if (this.props.kycApplication.kycDetails.documentType.toLowerCase() === 'passport') {
            // passport only needs one image.
            this.setState({singleImage: true})
        }
    }

    takePhoto = async () => {
        if (this.camera) {
            const options = {
                quality: 0.7,
                skipProcessing: true,
            };
            const data = await this.camera.takePictureAsync(options).then((data) => {
                this.setState({ isPictureTaken: true, [this.state.documentFront ? 'uriDocumentFront' : 'uriDocumentBack']: data.uri }, () => console.log(this.state));
            }).then(() => this.camera.pausePreview())
        }
    };

    _resetCamera() {
        this.setState({
            singleImage: false,
            documentFront: true,
            isPictureTaken: false,
            uriDocumentFront: null,
            uriDocumentBack: null,
        }, () => this.camera.resumePreview())
    }

    _goBack() {
        return this.state.isPictureTaken ? this._resetCamera() : this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep - 1, uriDocumentBack: null, uriDocumentFront: null})
    }

    _onNext(e) {
        if (!this.state.singleImage && this.state.documentFront) {
            // singleImage is False and document is currently front
            this.setState({isPictureTaken: false, documentFront: false}, () => this.camera.resumePreview());
            return
        }

        this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep + 1, documentBackUri: this.state.uriDocumentBack, documentFrontUri: this.state.uriDocumentFront})
    }

    maskFrame() {
        return {
            backgroundColor: this.state.isPictureTaken ? '#FFF' : 'rgba(1,1,1,0.6)',
        }
    };

    render() {
        const { isPictureTaken } = this.state;
        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 270) / 20);
        const maskColWidth = (width - 270) / 2;

        const documentType = addSpaceToString(this.props.kycApplication.kycDetails.documentType).toString();
        const documentSide = this.state.documentFront ? 'front' : 'back';

        return (
            <View style={styles.rootContainer}>
                <View style={styles.container}>
                    <GoBackHeader goBack={() => this._goBack()} dark={!isPictureTaken} {...this.props} />
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        permissionDialogTitle={`${strings('CameraScreen.permissionDialog')}`}
                        permissionDialogMessage={`${strings('CameraScreen.permissionDialog')}`}
                    >
                        <View style={styles.maskOutter}>
                            <View style={[{ flex: maskRowHeight - 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, styles.maskRow, this.maskFrame()]} >
                                <Headline style={{color: isPictureTaken ? '#000' : '#FFF', textAlign: 'center'}}>{strings('DocumentCameraScreen.Title', {type: documentType, side: documentSide})}</Headline>
                            </View>

                            <View style={[{ flex: 25 }, styles.maskCenter]}>
                                <View style={[{ width: maskColWidth }, this.maskFrame()]} />

                                <View style={styles.maskInner}/>

                                <View style={[{ width: maskColWidth }, this.maskFrame()]} />
                            </View>

                            <View style={[{ flex: maskRowHeight, justifyContent: 'center'}, styles.maskRow, this.maskFrame()]}>

                                {isPictureTaken ? <View style={styles.BottomButton}>
                                    <Button outline={true} onPress={() => this._resetCamera()} buttonText={strings('DocumentCameraScreen.Retake')}/>
                                    <Button onPress={() => this._onNext()} buttonText={strings('DocumentCameraScreen.Readable', {type: documentType})}/>
                                </View> : null}

                                {isPictureTaken ? null : <Text style={{color: '#FFF', textAlign: 'center', paddingHorizontal: 10}}>{strings('DocumentCameraScreen.Prompt', {side: documentSide, type: documentType})}</Text>}

                                {isPictureTaken ? null : <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.takePhoto()}>
                                    <View style={{position: 'absolute', bottom: height - (height * .97), alignItems: 'center', width: width, zIndex: 99,paddingHorizontal: 22}}>
                                        <View style={{
                                            width: 24,
                                            borderRadius: 100,
                                            borderColor: '#bfbfbf',
                                            borderWidth: 24
                                        }}/>
                                        <View style={{
                                            position: 'absolute',
                                            top: 4,
                                            width: 18,
                                            borderRadius: 100,
                                            borderColor: '#FFF',
                                            borderWidth: 20
                                        }}/>
                                    </View>
                                </TouchableNativeFeedback>}

                            </View>
                        </View>
                    </RNCamera>
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentCameraScreen);

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    preview: {
        flex: 11,
    },
    container: {
        flex: 1,
    },
    cameraView: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    maskOutter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    maskInner: {
        width: Dimensions.get('window').width * .9,
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
    },
    maskFrame: {
        backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
        width: '100%',
    },
    maskCenter: {
        flexDirection: 'row',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
    },
    BottomButton: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        padding: 20,
        bottom: 0
    }
});