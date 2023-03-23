import {useDispatch, useSelector} from 'react-redux';
import {closeCommonAlert} from '../../stores/slices/commonAlertSlice';
import {RootState} from '../../stores/store';
import DAlert from './alert/DAlert';
import RequestAlertContent from './alert/RequestAlertContent';

const CommonAlert = () => {
  const {message} = useSelector((state: RootState) => state.commonAlert);
  const dispatch = useDispatch();

  return (
    <>
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
    </>
  );
};

export default CommonAlert;
