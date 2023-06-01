import React, {useEffect} from 'react';
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
import {useFlipper} from '@react-navigation/devtools';
import RootStackNav from './src/navigators/RootStackNav';
import ErrorAlert from './src/components/common/ErrorAlert';
import SplashScreen from 'react-native-splash-screen';

import * as Sentry from '@sentry/react-native';
import {ErrorBoundary} from 'react-error-boundary';

Sentry.init({
  dsn: 'https://2fd6acc146d943ddb7a659b5dc18e632@o4505112210178048.ingest.sentry.io/4505112441782272',
});

if (__DEV__) {
  import('react-query-native-devtools').then(({addPlugin}) => {
    addPlugin({queryClient});
  });
}

function App(): JSX.Element {
  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);
  const {reset} = useQueryErrorResetBoundary();

  useEffect(() => {
    //setTimeout을 이용하면 몇초간 스플래시 스크린을 보여주고 싶은지 설정할 수 있다.
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <>
      <Sentry.TouchEventBoundary>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({resetErrorBoundary}) => <ErrorAlert />}>
            <Provider store={store}>
              <NavigationContainer ref={navigationRef}>
                <RootStackNav />
                <ErrorAlert />
              </NavigationContainer>
            </Provider>
          </ErrorBoundary>
        </QueryClientProvider>
      </Sentry.TouchEventBoundary>
    </>
  );
}

export default Sentry.wrap(App);
