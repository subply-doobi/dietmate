import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {closeCommonAlert} from '../../../stores/slices/commonAlertSlice';
import {RootState} from '../../../stores/store';
import {errorActionByCode} from '../../../util/handleError';
import DAlert from '../alert/DAlert';
import RequestAlertContent from '../alert/RequestAlertContent';
import {queryClient} from '../../../query/store';

const ErrorAlert = () => {
  // navigation
  const {reset} = useNavigation();
  const {errorCode} = useSelector((state: RootState) => state.commonAlert);
  const dispatch = useDispatch();
  return (
    <>
      <DAlert
        alertShow={errorCode ? true : false}
        onConfirm={() => {
          // errorCode && errorActionByCode[errorCode]
          //   ? errorActionByCode[errorCode](reset)
          //   : reset({
          //       index: 0,
          //       routes: [{name: 'Login'}],
          //     });
          reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
          dispatch(closeCommonAlert());
          queryClient.invalidateQueries();
        }}
        onCancel={() => {
          dispatch(closeCommonAlert());
          queryClient.invalidateQueries();
        }}
        NoOfBtn={1}
        renderContent={() => <RequestAlertContent />}
      />
    </>
  );
};

export default ErrorAlert;
