// 3rd
import {Provider} from 'react-redux';
import {QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';

// doobi

import {store} from './src/app/store/reduxStore';
import {queryClient} from './src/app/store/reactQueryStore';
import RootStackNav from './src/app/navigators/RootStackNav';
import ErrorAlert from './src/components/common/error/ErrorAlert';
import {navigationRef} from './src/app/navigators/navigationRef';
import AppLoading from './src/components/appLoading/AppLoading';

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <RootStackNav />
          <ErrorAlert />
          <AppLoading />
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}
export default App;
