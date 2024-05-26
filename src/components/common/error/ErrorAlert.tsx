import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {closeCommonAlert} from '../../../features/reduxSlices/commonAlertSlice';
import {RootState, store} from '../../../app/store/reduxStore';
import {convertCodeToMsg} from '../../../shared/utils/handleError';
import DAlert from '../../../shared/ui/DAlert';
import {queryClient} from '../../../app/store/reactQueryStore';
import styled from 'styled-components/native';
import {Col, TextMain} from '../../../shared/ui/styledComps';
import {setTutorialStart} from '../../../features/reduxSlices/commonSlice';

const RequestAlertContent = () => {
  const {errorCode} = useSelector((state: RootState) => state.commonAlert);
  const message = errorCode
    ? convertCodeToMsg[errorCode] ??
      `오류가 발생했어요. 오류가 지속되면 문의 바랍니다\n(errorCode: ${errorCode})`
    : ``;
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
  const {reset} = useNavigation();

  // redux
  const {errorCode} = useSelector((state: RootState) => state.commonAlert);
  const dispatch = useDispatch();

  return (
    <>
      <DAlert
        alertShow={errorCode ? true : false}
        onConfirm={() => {
          dispatch(closeCommonAlert());
          queryClient.invalidateQueries();
          const {
            common: {isTutorialMode},
          } = store.getState();
          isTutorialMode && store.dispatch(setTutorialStart());
          reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
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

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  text-align: center;
`;
