import {useEffect, useState} from 'react';
import {store} from './src/app/store/reduxStore';
import {Provider} from 'react-redux';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/app/store/reactQueryStore';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import RootStackNav from './src/app/navigators/RootStackNav';
import ErrorAlert from './src/components/common/error/ErrorAlert';
import BootSplash from 'react-native-bootsplash';

import {version as appVersion} from './package.json';
import DAlert from './src/shared/ui/DAlert';
import CommonAlertContent from './src/components/common/alert/CommonAlertContent';
import {link} from './src/shared/utils/linking';
import {
  APP_STORE_URL,
  IS_ANDROID,
  PLAY_STORE_URL,
} from './src/shared/constants';
import {getLatestVersion} from './src/shared/api/queries/version';
import {getNotShowAgainList} from './src/shared/utils/asyncStorage';
import {setTutorialStart} from './src/features/reduxSlices/commonSlice';

const loadSplash = new Promise(resolve =>
  setTimeout(() => {
    return resolve('loaded');
  }, 2000),
);

function App(): React.JSX.Element {
  // useState
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const init = async () => {
      // 앱 로딩
      await loadSplash;

      // 튜토리얼 모드 확인
      const isTutorialMode = !(await getNotShowAgainList()).tutorial;
      isTutorialMode && store.dispatch(setTutorialStart());

      // 최신 앱 버전을 서버에서 관리. 일단 임시코드
      const latestVersion = await getLatestVersion();
      if (!latestVersion) {
        setIsNetworkError(true);
        return;
      }

      appVersion !== latestVersion && setIsUpdateNeeded(true);
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
    });
  }, []);

  useEffect(() => {
    if (!isNetworkError) return;
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{name: 'ErrorPage', params: {errorCode: 404}}],
      });
    }
  }, [isNetworkError]);

  const visitStore = () => {
    IS_ANDROID ? link(PLAY_STORE_URL) : link(APP_STORE_URL);
    setIsUpdateNeeded(false);
  };
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <RootStackNav />
          {/* 업데이트 알럿 */}
          <ErrorAlert />
          <DAlert
            alertShow={isUpdateNeeded}
            onConfirm={() => visitStore()}
            onCancel={() => setIsUpdateNeeded(false)}
            NoOfBtn={2}
            confirmLabel="업데이트"
            renderContent={() => (
              <CommonAlertContent text="앱 업데이트가 필요합니다" />
            )}
          />
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}

// export default CodePush(codePushOptions)(App);
export default App;
