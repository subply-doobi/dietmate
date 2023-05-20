import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {closeCommonAlert} from '../../stores/slices/commonAlertSlice';
import {RootState} from '../../stores/store';
import {errorActionByCode} from '../../util/handleError';
import DAlert from './alert/DAlert';
import RequestAlertContent from './alert/RequestAlertContent';
import {
  useQueryErrorResetBoundary,
  QueryClientProvider,
} from '@tanstack/react-query';
const ErrorAlert = () => {
  // navigation
  const {navigate} = useNavigation();
  const {errorCode} = useSelector((state: RootState) => state.commonAlert);
  const dispatch = useDispatch();
  const {reset} = useQueryErrorResetBoundary();

  return (
    <>
      <DAlert
        alertShow={errorCode ? true : false}
        onConfirm={() => {
          errorCode === 500
            ? reset()
            : errorCode &&
              errorActionByCode[errorCode] &&
              errorActionByCode[errorCode](navigate);
          dispatch(closeCommonAlert());
        }}
        onCancel={() => {
          dispatch(closeCommonAlert());
        }}
        NoOfBtn={1}
        renderContent={() => <RequestAlertContent />}
      />
    </>
  );
};

export default ErrorAlert;
