import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {closeErrorAlert} from '../../../features/reduxSlices/errorAlertSlice';
import {RootState} from '../../../app/store/reduxStore';
import {
  getErrAlertActionByCode,
  msgByCode,
} from '../../../shared/utils/handleError';
import DAlert from '../../../shared/ui/DAlert';
import {queryClient} from '../../../app/store/reactQueryStore';
import styled from 'styled-components/native';
import {Col, TextMain} from '../../../shared/ui/styledComps';
import {setTutorialStart} from '../../../features/reduxSlices/commonSlice';

const RequestAlertContent = () => {
  const {msg} = useSelector((state: RootState) => state.errorAlert);
  return (
    <Container>
      <Col style={{marginTop: 28, alignItems: 'center'}}>
        <AlertText>{msg}</AlertText>
      </Col>
    </Container>
  );
};

const ErrorAlert = () => {
  // redux
  const {errorCode} = useSelector((state: RootState) => state.errorAlert);
  const dispatch = useDispatch();

  const onConfirm = () => {
    getErrAlertActionByCode(errorCode)?.();
  };

  return (
    <>
      <DAlert
        alertShow={errorCode ? true : false}
        onConfirm={onConfirm}
        onCancel={() => {
          dispatch(closeErrorAlert());
        }}
        NoOfBtn={1}
        renderContent={() => <RequestAlertContent />}
      />
    </>
  );
};

export default ErrorAlert;

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  text-align: center;
`;
