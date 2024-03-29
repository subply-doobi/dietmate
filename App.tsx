import {useEffect, useState} from 'react';
import {store} from './src/stores/store';
import {Provider} from 'react-redux';
import {
  useQueryErrorResetBoundary,
  QueryClientProvider,
} from '@tanstack/react-query';
import {queryClient} from './src/query/store';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import RootStackNav from './src/navigators/RootStackNav';
import ErrorAlert from './src/components/common/error/ErrorAlert';
import BootSplash from 'react-native-bootsplash';

import {version as appVersion} from './package.json';
import DAlert from './src/components/common/alert/DAlert';
import CommonAlertContent from './src/components/common/alert/CommonAlertContent';
import {link} from './src/util/common/linking';
import {
  APP_STORE_URL,
  IS_ANDROID,
  IS_IOS,
  PLAY_STORE_URL,
} from './src/constants/constants';
import {getLatestVersion} from './src/query/queries/version';

const loadSplash = new Promise(resolve =>
  setTimeout(() => {
    return resolve('loaded');
  }, 2000),
);

function App(): React.JSX.Element {
  // useState
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);

  const navigationRef = useNavigationContainerRef();
  const {reset} = useQueryErrorResetBoundary();

  useEffect(() => {
    const init = async () => {
      // 앱 로딩
      await loadSplash;

      // TBD | 최신 앱 버전을 서버에서 관리하도록 수정할 것. 일단 임시코드
      await getLatestVersion().then(res => {
        appVersion !== res?.latestVersion && setIsUpdateNeeded(true);
      });
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
    });
  }, []);

  // etc
  const visitStore = () => {
    IS_ANDROID ? link(PLAY_STORE_URL) : link(APP_STORE_URL);
    setIsUpdateNeeded(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <RootStackNav />
          <ErrorAlert />
          <DAlert
            alertShow={isUpdateNeeded}
            onConfirm={() => visitStore()}
            onCancel={() => setIsUpdateNeeded(false)}
            NoOfBtn={1}
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

export default App;
