apk 추출
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

aab 추출
npx react-native build-android --mode=release

release-mode 빌드
yarn android --mode release

git crlf
git config --global core.autocrlf true
