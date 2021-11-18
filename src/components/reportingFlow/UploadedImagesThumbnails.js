import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

import AsyncImage from '../AsyncImage'

class UploadedImagesThumbnails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }


    render() {

        var thumbnails = this.props.images.map(obj => (
            <AsyncImage
                style={styles.thumbnail}
                source={{uri:  obj.image_url}}
            />
            )
        );

        console.log(this.props.images);

        return (
            <View style={styles.container}>
                {thumbnails}
                {this.props.children}
            </View>
        )
    }
}
export default UploadedImagesThumbnails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        display: 'flex',
        flexDirection: 'row'
    },
    thumbnail: {
        width: 60,
        height: 60,
        margin: 2,
    }
});