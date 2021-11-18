export default class RNFirebase {
    static initializeApp() {
        RNFirebase.firebase = new MockFirebase();
        RNFirebase.promises = []
        return RNFirebase.firebase
    }

    static reset() {
        RNFirebase.promises = []
        RNFirebase.firebase.databaseInstance = null
    }

    static waitForPromises() {
        return Promise.all(RNFirebase.promises)
    }

    static analytics () {}

    static app () {}
}
