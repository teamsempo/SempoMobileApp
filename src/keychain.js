import * as Keychain from 'react-native-keychain';


// todo- for IOS implement accessControl
export async function saveString(key, value) {
    try {
        await Keychain.setInternetCredentials(key, key, value);
        console.log(`Keychain: saved string for key: ${key}`);
    } catch (err) {
        console.log(`Keychain: failed to save string for key: ${key} error: ${err}`);
    }
}

export async function loadString(key) {
    try {
        const credentials = await Keychain.getInternetCredentials(key);
        if (credentials) {
            console.log(`Keychain: loaded string for key: ${key}`);
            return credentials.password;
        }
        console.log(`Keychain: string does not exist for key: ${key}`);
    } catch (err) {
        console.log(`Keychain: failed to load string for key: ${key} error: ${err}`);
    }
    return null;
}

export async function saveObject(key, value) {
    const jsonValue = JSON.stringify(value);
    await saveString(key, jsonValue);
}

export async function loadObject(key) {
    const jsonValue = await loadString(key);
    try {
        const objectValue = JSON.parse(jsonValue);
        console.log(`Keychain: parsed object for key: ${key}`);
        return objectValue;
    } catch (err) {
        console.log(`Keychain: failed to parse object for key: ${key} error: ${err}`);
    }
    return null;
}

export async function remove(key) {
    try {
        await Keychain.resetInternetCredentials(key);
        console.log(`Keychain: removed value for key: ${key}`);
    } catch (err) {
        console.log(`Keychain: failed to remove value for key: ${key} error: ${err}`);
    }
}