how to build to android :

1. npm run build
2. npx cap add android (one time only)
3. npx cap sync android
4. cd android // go to android directory
5. ./gradlew assembleDebug // ini debug
6. ./gradlew assembleRelease // ini release

apk will generated in this folder :

- android/app/build/outputs/apk/debug/app-debug.apk
