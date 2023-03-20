import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {RootState} from '../../../stores/store';
import {Col, TextMain} from '../../../styles/styledConsts';

const RequestAlertContent = () => {
  const {message} = useSelector((state: RootState) => state.commonAlert);
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
