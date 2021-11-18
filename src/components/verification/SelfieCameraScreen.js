'use strict';
import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    TouchableNativeFeedback,
    Image,
    ScrollView
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import { Headline, Subheading, List, Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from "react-redux";
import { strings } from '../../../locales/i18n';
import Button from "../Button";
import {createKYCApplication, editKYCApplicationRequest, updateKYCDetails} from "../../reducers/kycApplicationReducer";
import GoBackHeader from "./GoBackHeader";

const mapStateToProps = (state) => {
    return {
        kycApplication: state.kycApplication,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateKYCDetails: (payload) => dispatch(updateKYCDetails(payload)),
        createKYCApplication: (body) => dispatch(createKYCApplication({body})),
        editKYCApplicationRequest: (body) => dispatch(editKYCApplicationRequest({body}))
    };
};

class SelfieCameraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uriSelfie: null,
            isPictureTaken: false,
            isPrompt: true,
        }
    }

    takePhoto = async () => {
        if (this.camera) {
            const options = {
                quality: 0.7,
                skipProcessing: true,
            };
            const data = await this.camera.takePictureAsync(options).then((data) => {
                this.setState({ isPictureTaken: true, uriSelfie: data.uri });
            }).then(() => this.camera.pausePreview())
        }
    };

    _resetCamera() {
        this.setState({isPictureTaken: false, uriSelfie: null}, () => this.camera.resumePreview())
    }

    _goBack() {
        return this.state.isPictureTaken ? this._resetCamera() : this.props.updateKYCDetails({flowStep: this.props.kycApplication.kycDetails.flowStep - 1})
    }

    _onNext() {
        let kyc = this.props.kycApplication.kycDetails;
        // NOTE: uri is converted into Base64 in the saga.
        let body = {
            account_type: kyc.account_type,
            document_type: kyc.documentType,
            document_country: kyc.country,
            document_front_base64: kyc.documentFrontUri,
            document_back_base64: kyc.documentBackUri,
            selfie_base64: this.state.uriSelfie,
            is_mobile: true,
        };

        let kyc_status = this.props.kycApplication.kycApplicationState.kyc_status;
        if (kyc_status !== null && typeof kyc_status !== 'undefined') {
            // server side kycApplication exists
            this.props.editKYCApplicationRequest(body);
        } else {
            this.props.createKYCApplication(body);
        }
    };

    maskFrame() {
        return {
            backgroundColor: this.state.isPictureTaken ? '#FFF' : 'rgba(1,1,1,0.6)',
        }
    };

    render() {
        const { isPictureTaken, isPrompt } = this.state;
        const { height, width } = Dimensions.get('window');

        const maskRowHeight = Math.round((height - 270) / 20);
        const maskColWidth = (width - 270) / 2;

        return (
            <View style={styles.rootContainer}>
                <View style={styles.container}>
                    <GoBackHeader goBack={() => this._goBack()} dark={!isPictureTaken && !isPrompt} {...this.props} />
                    {isPrompt
                        ?
                        <ScrollView>
                            <View style={{paddingVertical: 60}}>
                                <View style={{alignItems: 'center', paddingVertical: 20}}>

                                    <Image
                                        source={require('../img/verification_selfie.png')}
                                        style={{width: width / 1.5, height: height / 3}}
                                        resizeMode='contain'
                                    />

                                </View>
                                <Headline style={{paddingHorizontal: 15}}>{strings('SelfieCameraScreen.Title')}</Headline>
                                <View style={styles.List}>
                                    <List.Section>
                                        <List.Subheader>{strings('SelfieCameraScreen.MakeSure')}</List.Subheader>
                                        <List.Item
                                            title={strings('SelfieCameraScreen.FaceCovered')}
                                            left={props => <Icon style={styles.Icon} name={'face'} size={30} color="#000"/>}
                                        />
                                        <List.Item
                                            title={strings('SelfieCameraScreen.DocumentReadable')}
                                            left={props => <Icon style={styles.Icon} name={'file-document-box-outline'} size={30} color="#000"/>}
                                        />
                                    </List.Section>
                                </View>
                                <View style={{paddingHorizontal: 20, position: 'absolute', bottom: 0, left: 0, right: 0}}>
                                    <Button onPress={() => this.setState({isPrompt: false})} buttonText={strings('Common.Start')}/>
                                </View>
                            </View>
                        </ScrollView>
                        : <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.front}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        permissionDialogTitle={`${strings('CameraScreen.permissionDialog')}`}
                        permissionDialogMessage={`${strings('CameraScreen.permissionDialog')}`}
                    >
                        <View style={styles.maskOutter}>
                            <View style={[{ flex: maskRowHeight - 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, styles.maskRow, this.maskFrame()]} >
                                <Headline style={{color: isPictureTaken ? '#000' : '#FFF', textAlign: 'center'}}>{strings("SelfieCameraScreen.Title")}</Headline>
                            </View>

                            <View style={[{ flex: 25 }, styles.maskCenter]}>
                                <View style={[{ width: maskColWidth }, this.maskFrame()]} />

                                <View style={styles.maskInner}/>

                                <View style={[{ width: maskColWidth }, this.maskFrame()]} />
                            </View>

                            <View style={[{ flex: maskRowHeight, justifyContent: 'center'}, styles.maskRow, this.maskFrame()]}>

                                {isPictureTaken ? null : <View style={{position: 'absolute', bottom: height - (height * .86), width: width, zIndex: 99, paddingHorizontal: 22}}>
                                    <Subheading style={{color: '#FFF', textAlign: 'center'}}>{strings("SelfieCameraScreen.Prompt")}</Subheading>
                                </View>}

                                {isPictureTaken ? <View style={styles.BottomButton}>
                                    <Button outline={true} onPress={() => this._resetCamera()} buttonText={strings("DocumentCameraScreen.Retake")}/>
                                    <Button onPress={() => this._onNext()} buttonText={strings("SelfieCameraScreen.Clear")}/>
                                </View> : null}

                                { isPictureTaken ? null : <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.takePhoto()}>
                                    <View style={{position: 'absolute', bottom: height - (height * .97), alignItems: 'center', width: width, zIndex: 99}}>
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
                    </RNCamera>}
                </View>
            </View>
        );

        // ======= Oval face mask. deprecated as need ID in photo ======
        //
        // return (
        //     <View style={styles.rootContainer}>
        //         <View style={styles.container}>
        //             <GoBackHeader goBack={() => this._goBack()} dark={!isPictureTaken} {...this.props} />
        //             <RNCamera
        //                 pausePreview={true}
        //                 ref={ref => {
        //                     this.camera = ref;
        //                 }}
        //                 style={styles.preview}
        //                 type={RNCamera.Constants.Type.front}
        //                 flashMode={RNCamera.Constants.FlashMode.off}
        //                 barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        //                 permissionDialogTitle={`${strings('CameraScreen.permissionDialog')}`}
        //                 permissionDialogMessage={`${strings('CameraScreen.permissionDialog')}`}
        //             >
        //
        //                 <View style={{position: 'absolute', top: height * .08, width: width, zIndex: 99}}>
        //                     <Headline style={{color: isPictureTaken ? '#000' : '#FFF', textAlign: 'center'}}>{strings("SelfieCameraScreen.Title")}</Headline>
        //                 </View>
        //
        //                 <View
        //                     style={{
        //
        //                         position: 'absolute',
        //                         top: -width/2 + 120,
        //                         left: -width/2 + 50,
        //                         right: -width/2 + 50,
        //                         bottom: -width/2 + 120,
        //                         backgroundColor: 'transparent',
        //
        //                         borderWidth: width/1.8,
        //                         borderRadius: width,
        //                         borderColor: isPictureTaken ? '#FFF' : 'rgba(1,1,1,0.6)',
        //                     }}
        //                 />
        //
        //                 <View
        //                     style={{
        //
        //                         position: 'absolute',
        //                         top: width/2 - 40,
        //                         left: width/2 - 110,
        //                         right: width/2 - 110,
        //                         bottom: width/2 - 40,
        //                         backgroundColor: 'transparent',
        //
        //                         borderWidth: 2,
        //                         borderRadius: width/1.8,
        //                         borderColor: '#FFF',
        //                     }}
        //                 />
        //
        //                 {isPictureTaken ? null : <View style={{position: 'absolute', bottom: height - (height * .86), width: width, zIndex: 99}}>
        //                     <Subheading style={{color: '#FFF', textAlign: 'center'}}>{strings("SelfieCameraScreen.Prompt")}</Subheading>
        //                 </View>}
        //
        //                 {isPictureTaken ? <View style={styles.BottomButton}>
        //                     <Button outline={true} onPress={() => this._resetCamera()} buttonText={strings("DocumentCameraScreen.Retake")}/>
        //                     <Button onPress={() => this._onNext()} buttonText={strings("SelfieCameraScreen.Clear")}/>
        //                 </View> : null}
        //
        //                 { isPictureTaken ? null : <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => this.takePhoto()}>
        //                     <View style={{position: 'absolute', bottom: height - (height * .97), alignItems: 'center', width: width, zIndex: 99}}>
        //                         <View style={{
        //                             width: 24,
        //                             borderRadius: 100,
        //                             borderColor: '#bfbfbf',
        //                             borderWidth: 24
        //                         }}/>
        //                         <View style={{
        //                             position: 'absolute',
        //                             top: 4,
        //                             width: 18,
        //                             borderRadius: 100,
        //                             borderColor: '#FFF',
        //                             borderWidth: 20
        //                         }}/>
        //                     </View>
        //                 </TouchableNativeFeedback>}
        //
        //             </RNCamera>
        //         </View>
        //     </View>
        // );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelfieCameraScreen);

const styles = StyleSheet.create({
    Icon: {
        margin: 8
    },
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