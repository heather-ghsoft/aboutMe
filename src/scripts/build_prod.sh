./scripts/config_to_prod.sh
# ionic config set dev_push false
npm install
gulp build --release


cordova build -release android
rm ~/Documents/Introduce.apk
# Sign youre app with your private key using jarsigner
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore introduce.keystore ./platforms/android/build/outputs/apk/android-release-unsigned.apk introduce
# password: 20na150618

# Align the final APK package using zipalign
ANDROID_HOME=/usr/local/opt/android-sdk
/usr/local/Cellar/android-sdk/24.4.1_1/build-tools/24.0.1/zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk ~/Documents/Introduce.apk


# Build for ios
ionic build ios --release
