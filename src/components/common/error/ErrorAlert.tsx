import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {closeCommonAlert} from '../../../features/reduxSlices/commonAlertSlice';
import {RootState} from '../../../app/store/reduxStore';
import {convertCodeToMsg} from '../../../shared/utils/handleError';
import DAlert from '../../../shared/ui/DAlert';
import {queryClient} from '../../../app/store/reactQueryStore';
import styled from 'styled-components/native';
import {Col, TextMain} from '../../../shared/ui/styledComps';
import {setTutorialStart} from '../../../features/reduxSlices/commonSlice';

const RequestAlertContent = () => {
  const {errorCode} = useSelector((state: RootState) => state.commonAlert);
  const message = convertCodeToMsg(errorCode);
  return (
    <Container>
      <Col style={{marginTop: 28, alignItems: 'center'}}>
        <AlertText>{message}</AlertText>
      </Col>
    </Container>
  );
};

const ErrorAlert = () => {
  // navigation
  const {navigate, reset} = useNavigation();

  // redux
  const {isTutorialMode} = useSelector((state: RootState) => state.common);
  const {errorCode} = useSelector((state: RootState) => state.commonAlert);
  const dispatch = useDispatch();

  const onConfirm = () => {
    dispatch(closeCommonAlert());
    queryClient.invalidateQueries();
    isTutorialMode && dispatch(setTutorialStart());
    reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <>
      <DAlert
        alertShow={errorCode ? true : false}
        onConfirm={onConfirm}
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

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  text-align: center;
`;
