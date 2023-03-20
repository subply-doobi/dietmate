import {store} from './src/stores/store';
import {Provider} from 'react-redux';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/query/store';

import Root from './src/components/common/Root';

if (__DEV__) {
  import('react-query-native-devtools').then(({addPlugin}) => {
    addPlugin({queryClient});
  });
}
function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Root />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
