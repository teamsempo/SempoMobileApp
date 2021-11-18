import { getToken, getHostURL } from '../utils'

export const imageUploadAPI = async (image_data, imageType, transferId) => {

    const data = new FormData();

    data.append("image", {
        uri: image_data.uri  ,
        type: image_data.type,
        name: image_data.fileName
    });

    //build payload packet
    let postData = {
        method: 'POST',
        headers: {
            'Authorization': await getToken(),
            'Content-Type': 'multipart/form-data',
        },
        body: data,
    };

    return fetch(await getHostURL() + '/api/v1/image/?imageType=' + imageType + '&transferId=' + transferId, postData)
        .then((response) => response.json())
            .then((responseJson) => {

                console.log('responseJson',responseJson);
                return responseJson;

            })
            .catch((error) => {

                console.log('error',error);

            });
};
