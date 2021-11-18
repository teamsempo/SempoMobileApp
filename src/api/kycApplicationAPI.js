import axios from 'axios'
import { getToken, getHostURL, generateQueryString } from '../utils';

// load KYC application
export const loadKYCApplicationAPI = async ({query}) => {
    if (query) {
        const query_string = generateQueryString(query);
        var URL = `/api/v1/kyc_application/${query_string}`;
    } else {
        URL = '/api/kyc_application/';
    }

    return axios(await getHostURL() + URL, {
        headers: {
            'Authorization': await getToken(),
        },
        method: 'get',
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};

// create KYC application
export const createKYCApplicationAPI = async ({body}) => {
    return axios(await getHostURL()  + '/api/v1/kyc_application/' , {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(body),
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};

export const editKYCApplicationAPI = async ({body}) => {
    return axios(await getHostURL() + '/api/v1/kyc_application/' , {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        data: JSON.stringify(body)
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};

// document upload
export const uploadDocumentAPI = async ({body}) => {

    const data = new FormData();

    data.append("image", {
        uri: body.uri  ,
        type: body.type,
        name: body.fileName,

        reference: body.reference,
        kyc_application_id: body.kyc_application_id
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

    return fetch(await getHostURL() + '/api/v1/document_upload/', postData)
        .then((response) => response.json())
        .then((responseJson) => {

            return responseJson;

        })
        .catch((error) => {

            console.log('error',error);

        });
};


// Create bank account api
export const createBankAccountAPI = async ({body}) => {
    return axios(await getHostURL()  + '/api/v1/bank_account/' , {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(body),
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};