import axios from 'axios'
import { getToken, getHostURL } from '../utils'

// exportAPI. date_range = day, week. defaults to all.
export const exportAPI = async (date_range, email) => {
    return axios(await getHostURL() + '/api/v1/me/export/', {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify({'date_range': date_range, 'email': email})
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};