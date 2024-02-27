import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {closeCommonAlert} from '../../../stores/slices/commonAlertSlice';
import {RootState} from '../../../stores/store';
import {convertCodeToMsg, errorActionByCode} from '../../../util/handleError';
import DAlert from '../alert/DAlert';
import {queryClient} from '../../../query/store';
import styled from 'styled-components/native';
import {Col, TextMain} from '../../../styles/styledConsts';

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

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  text-align: center;
`;
