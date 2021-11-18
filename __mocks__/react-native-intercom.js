const mockReactNativeIntercom = {
    registerIdentifiedUser: jest.fn().mockReturnValue(Promise.resolve()),
    registerUnidentifiedUser: jest.fn().mockReturnValue(Promise.resolve()),
    updateUser: jest.fn().mockReturnValue(Promise.resolve()),
    reset: jest.fn().mockReturnValue(Promise.resolve()),
    logEvent: jest.fn().mockReturnValue(Promise.resolve()),
    handlePushMessage: jest.fn().mockReturnValue(Promise.resolve()),
    displayMessenger: jest.fn().mockReturnValue(Promise.resolve()),
    hideMessenger: jest.fn().mockReturnValue(Promise.resolve()),
    displayMessageComposer: jest.fn().mockReturnValue(Promise.resolve()),
    displayMessageComposerWithInitialMessage: jest.fn().mockReturnValue(Promise.resolve()),
    displayConversationsList: jest.fn().mockReturnValue(Promise.resolve()),
    getUnreadConversationCount: jest.fn().mockReturnValue(Promise.resolve()),
    setLauncherVisibility: jest.fn().mockReturnValue(Promise.resolve()),
    setInAppMessageVisibility: jest.fn().mockReturnValue(Promise.resolve()),
    setupAPN: jest.fn().mockReturnValue(Promise.resolve()),
    registerForPush: jest.fn().mockReturnValue(Promise.resolve()),
    setUserHash: jest.fn().mockReturnValue(Promise.resolve()),
    setBottomPadding: jest.fn().mockReturnValue(Promise.resolve()),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
};
export default mockReactNativeIntercom;
