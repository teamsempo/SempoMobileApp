[![CircleCI](https://circleci.com/gh/teamsempo/SempoMobileApp.svg?style=svg&circle-token=22ab617a9c6d8252e3f9ef08ca18475400ae52d5)](https://circleci.com/gh/teamsempo/SempoMobileApp)

# SempoVendorMobile

Mobile App for vendors and beneficiaries to accept/send payments in Sempo program. 

NOTE: only Android is currently supported.

### To Run (locally)
You need to install Java 8, the Android SDK, and Node 11 to run the app.

Install front-end requirements
```
npm install
```
Connect an android device via USB to your computer.
```
react-native run-android
```
This will take some time if your internet is slow.
  
If you are running it against a local development server, be sure to set up port forwarding with  
```
adb reverse tcp:9000 tcp:9000
```  

### Testing
  
To run the mobile test suite, simply run: 
```
npm run tests
```  

You can also check your code test coverage using:  
```
npm run test:coverage
```  

### Tools and Debugging

Setup a chrome [CORS plugin.](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)

```
Enable cross-origin resource sharing
```

Debugging on device with chrome browser
```
Start Remote JS Debugging
```

To see code changes in real time.
```
Enable Hot Reloading
```

Sometimes you need to clean gradle. In android folder run:
```
./gradlew clean
```

To view dependencies:
```
./gradlew :app:dependencies
```

Other known issues:
- Ensure the python environment variable `PYDEVD_USE_FRAME_EVAL=NO` is set. (pycharm bug)

### Deployment Guide

1. Ensure you've correctly deployed the [Sempo Web App](https://github.com/teamsempo/SempoBlockchain) and [Sempo Delegator](https://github.com/teamsempo/GoDelegate) (the delegator handles multi-instance support).
2. Update your [`.env.production`](https://github.com/teamsempo/SempoMobileApp/blob/master/android/.env.production) with the correct config. You'll need to change `SEMPO_API_URL`, `IPDATA_KEY` and `DELEGATOR_URL`
3. Update your [`android/gradle.properties`](https://github.com/teamsempo/SempoMobileApp/blob/master/android/gradle.properties#L23-L26)
4. Follow the default react native deployment steps to [publish to the Google Play Store](https://reactnative.dev/docs/signed-apk-android)


### App Requirements

1. Keep the Android APK size small
⋅⋅⋅Default to using _smaller_ packages, with _less_ functionality
⋅⋅⋅Use [packagephobia](https://packagephobia.now.sh) to check a package size
2. Low data usage
3. Works offline
4. *Must* Compatible with Android 4.1 `16 (Jelly Bean)`
