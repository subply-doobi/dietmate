import {useFlipper} from '@react-navigation/devtools';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import RootStackNav from '../../navigators/RootStackNav';
import {queryClient} from '../../query/store';
import {closeCommonAlert} from '../../stores/slices/commonAlertSlice';
import {RootState} from '../../stores/store';
import {useHandleError} from '../../util/handleError';
import DAlert from './alert/DAlert';
import RequestAlertContent from './alert/RequestAlertContent';

const Root = () => {
  // react-query defaultOptions
  const handleError = useHandleError();
  queryClient.setDefaultOptions({
    queries: {
      retry: 0,
      onError: handleError,
    },
    mutations: {
      onError: handleError,
    },
  });

  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);
  const {message} = useSelector((state: RootState) => state.commonAlert);
  const dispatch = useDispatch();

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStackNav />
      <DAlert
        alertShow={message !== '' ? true : false}
        onConfirm={() => {
          dispatch(closeCommonAlert());
        }}
        onCancel={() => {
          dispatch(closeCommonAlert());
        }}
        NoOfBtn={1}
        renderContent={() => <RequestAlertContent />}
      />
    </NavigationContainer>
  );
};

export default Root;
