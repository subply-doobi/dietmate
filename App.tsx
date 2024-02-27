import {useEffect} from 'react';
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

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef();
  const {reset} = useQueryErrorResetBoundary();

  // useEffect(() => {
  //   //setTimeout을 이용하면 몇초간 스플래시 스크린을 보여주고 싶은지 설정할 수 있다.
  //   setTimeout(() => {
  //     SplashScreen.hide();
  //   }, 1000);
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <RootStackNav />
          <ErrorAlert />
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
