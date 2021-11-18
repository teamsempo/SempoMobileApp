import { mockApi } from '../../../../__mocks__/mockAxios';
import { checkVersionAPI } from '../../../api/versionAPI.js';
import { storeToken, storeHostURL } from "../../../utils";

// todo: make this an array to be called for all possible outcomes
const validBody = {body: {version: '1.0.0'}};
const validResult = {action: 'ok'};

// todo- do we even need API tests? it' effectively called in the saga...
describe('checkVersionAPI', () => {

    it('checkVersionAPI should get data from the server and return version action', () => {

        let catchFn = jest.fn(),
            thenFn = jest.fn();

        // using the component, which should make a server response
        // let clientMessage = {body: {version: '1.0.0'}};

        return checkVersionAPI(validBody).then(result => {
            // todo - check api has been called
            // expect(checkVersionAPI).toHaveBeenCalledTimes(1)
            expect(result).toEqual(validResult)
        })
        // console.log('a',a)

        // since `post` method is a spy, we can check if the server request was correct
        // a) the correct method was used (post)
        // b) went to the correct web service URL ('/api/me/version/')
        // c) if the payload was correct ('{'version': '1'}')
        // expect(mockApi.post).toHaveBeenCalledWith('/api/me/version/', {data: clientMessage });
        //
        // // simulating a server response
        // let responseObj = { version: '1.0.0', action: 'ok' };
        // mockApi.mockResponse(responseObj);
        //
        // // checking the `then` spy has been called and if the
        // // response from the server was converted to upper case
        // expect(thenFn).toHaveBeenCalledWith(responseObj);
        //
        // // catch should not have been called
        // expect(catchFn).not.toHaveBeenCalled();
    });
});