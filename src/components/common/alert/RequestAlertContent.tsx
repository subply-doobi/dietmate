import {useSelector} from 'react-redux';
import styled from 'styled-components/native';

import {RootState} from '../../../stores/store';
import {Col, TextMain} from '../../../styles/styledConsts';
import {convertCodeToMsg} from '../../../util/handleError';

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

export default RequestAlertContent;

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  text-align: center;
`;
