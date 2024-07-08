// RN
import {useEffect} from 'react';

// 3rd
import {Provider} from 'react-redux';
import {QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';

// doobi
import {store} from './src/app/store/reduxStore';
import {queryClient} from './src/app/store/reactQueryStore';
import {getNotShowAgainList} from './src/shared/utils/asyncStorage';
import {setTutorialStart} from './src/features/reduxSlices/commonSlice';
import RootStackNav from './src/app/navigators/RootStackNav';
import ErrorAlert from './src/components/common/error/ErrorAlert';
import {navigationRef} from './src/app/navigators/navigationRef';

const loadSplash = new Promise(resolve =>
  setTimeout(() => {
    return resolve('loaded');
  }, 2000),
);

function App(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      // 앱 로딩
      await loadSplash;

      // 튜토리얼 모드 확인
      const isTutorialMode = !(await getNotShowAgainList()).tutorial;
      isTutorialMode && store.dispatch(setTutorialStart());
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <RootStackNav />
          {/* 업데이트 알럿 */}
          <ErrorAlert />
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}
export default App;
