import axios from 'axios'
import { getToken, getHostURL } from '../utils'

// sendFeedbackAPI call - question, rating 1-5, additional information
export const sendFeedbackAPI = async (question, rating, additional_information) => {
    return axios(await getHostURL() + '/api/v1/me/feedback/', {
        headers: {
            'Authorization': await getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify({'question': question, 'rating': rating, 'additional_information': additional_information})
    })
        .then(function (response) {
            return response.data
        })
        .catch(error => {
            throw error;
        });
};