import {
    storeToken, getToken, removeToken, addSpaceToString,
    trim, generateQueryString, parseEthQRCode, padArray,
    byteArrayToUtf8, utf8ToByteArray, hexStringToByteArray,
    byteArrayToHexString, intToThreeByteArray, threeByteArrayToInt,
    capitalize, stringToColour, handleResponse
} from '../../utils.js';

// TODO: implement NFC utils tests

describe('trim fn', () => {
    it('return trimmed string', () => {
        const tests = [
            ['a', 'a'],
            [' a', 'a'],
            [' a ', 'a'],
            [' a a ', 'a a'],
        ];
        tests.forEach(([string, formatted]) => {
            expect(string.trim()).toEqual(formatted)
        })
    })
});

describe('asyncStorage mock', () => {
    const userToken = 'userTOKEN123@1234';

    it('storeToken', () => {
        return storeToken(userToken)
    });
    it('getToken', () => {
        return getToken('userToken').then(token => {
            expect(token).toBe(userToken)
        })
    });
    it('removeToken', () => {
        return removeToken().finally(() => getToken('userToken').then(userToken => {
            expect(userToken).toBe(undefined)
        }))
    })
});

describe('generateQueryString fn', () => {
    it('return query string', () => {
        const tests = [
            [{'user': 'bob@bob'}, '?user=bob@bob'],
            [{'user': 123}, '?user=123'],
            [{'user': 123, 'pages': 'one two'}, '?user=123&pages=one two'],
        ];
        tests.forEach(([query, formatted]) => {
            expect(generateQueryString(query)).toEqual(formatted)
        })
    });
    it('Throw TypeError', () => {
        const tests = ['hello', 123];
        tests.forEach((query) => {
            expect(() => {
                generateQueryString(query);
            }).toThrow(TypeError('Query must be object'))
        })
    })
});


describe('parseEthQRCode fn', () => {
    const ethAddress = '0x7A5E7947b9FAe4754bd8Fa63385460d0d1AbaB89';

    it('standard eth address', () => {
        const tests = [
            [ethAddress, {"address": ethAddress}],
            ['ethereum:'+ethAddress, {"address": 'ethereum:'+ethAddress}],
            [ethAddress+'?food=apple,banana', {"address": ethAddress, "food": 'apple,banana'}]
        ];
        tests.forEach(([address, formatted]) => {
            expect(parseEthQRCode(address)).toEqual(formatted)
        })
    })
});

describe('addSpaceToString fn', () => {
    it('Adds spaces before caps', () => {
        expect(addSpaceToString('ILikeToEatPizza')).toEqual('ILike To Eat Pizza')
    })
});

describe('padArray fn', () => {
    it('Pads array with the right amount of elements', () => {
        const array = ['abc', 'def']
        expect(padArray(array, 4, 'a')).toEqual(['abc', 'def', 'a', 'a'])
    })
});

describe('byteArrayToUtf8 fn', () => {
    it('Converts byteArray to UTF8', () => {
        var uint8 = new Uint8Array(1);
        uint8[0] = '50';
        expect(byteArrayToUtf8(uint8)).toEqual("2");
    })
});

describe('utf8ToByteArray fn', () => {
    it('Converts UTF8 to byteArray', () => {
        expect(utf8ToByteArray('2')).toEqual([50]);
    })
});

describe('hexStringToByteArray fn', () => {
    it('Converts byteArray to UTF8', () => {
        expect(hexStringToByteArray('abc')).toEqual([171, 12]);
    })
});

describe('byteArrayToHexString fn', () => {
    it('Converts byteArray to hex string', () => {
        var uint8 = new Uint8Array(1);
        uint8[0] = '50';
        expect(byteArrayToHexString(uint8)).toEqual("32");
    })
});

describe('intToThreeByteArray fn', () => {
    it('Converts int to three byte array', () => {
        expect(intToThreeByteArray(5)).toEqual([5, 0, 0]);
    })
});

describe('threeByteArrayToInt fn', () => {
    it('Converts threeByteArrayToInt to int', () => {
        expect(threeByteArrayToInt([5, 0, 0])).toEqual(5);
    })
});

describe('capitalize fn', () => {
    it('capitalizes string', () => {
        expect(capitalize('donkey kong is here')).toEqual('Donkey kong is here');
    })
});

describe('stringToColour fn', () => {
    it('Changes string to colour', () => {
        // DK is purple
        expect(stringToColour('donkey kong is here')).toEqual('#8741d0');
    })
});

describe('handleResponse fn', () => {
    it('Returns response.data', () => {
        expect(handleResponse({data: 'DK Was Here'})).toEqual('DK Was Here');
    })
});
