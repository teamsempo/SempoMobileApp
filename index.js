import { AppRegistry, YellowBox } from 'react-native';
import 'text-encoding-polyfill'
import SempoApp from './src/App';
import { USE_DELEGATOR } from './src/config'
import * as Sentry from "@sentry/react-native";
import backgroundMessaging from './src/backgroundMessaging.js';
import { version } from './package.json';

const sentryConfigKey = process.env.NODE_ENV === `development` ? null : '18bd3384b94248c58b688b03ab41221a';
console.log('sentryConfigKey:',sentryConfigKey);
Sentry.init({
    dsn: `https://${sentryConfigKey}@sentry.io/1365796`
});
Sentry.setRelease('sempo-android-app@'+version);

import {setJSExceptionHandler} from 'react-native-exception-handler';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

console.log("Index js")

AppRegistry.registerComponent('Sempo', () => {
    console.log('registering App');
    return SempoApp
});
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundMessaging);
