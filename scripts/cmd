package check
npx @rnx-kit/align-deps --requirements react-native@[major.minor]

apk 추출
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

aab 추출
npx react-native build-android --mode=release

release-mode 빌드
yarn android --mode release

git crlf
git config --global core.autocrlf true

code-push
appcenter codepush release-react -a subply/dietmate -d Production -m
appcenter codepush release-react -a subply/dietmateIos -d Production -m

tags
git push -d origin v1.0.18
