import axios from 'axios'
import { getToken, getHostURL } from '../utils'

export const checkVersionAPI = async ({body}) => {
    return axios(await getHostURL() + '/api/v1/me/version/', {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(body)
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};