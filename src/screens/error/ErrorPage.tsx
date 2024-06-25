// 3rd
import styled from 'styled-components/native';
import RNRestart from 'react-native-restart';

// doobi
import {icons} from '../../shared/iconSource';
import {
  Col,
  Container,
  Icon,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';

const ErrorPage = () => {
  return (
    <Container style={{alignItems: 'center', justifyContent: 'center'}}>
      <Col style={{alignItems: 'center'}}>
        <Icon source={icons.networkError_80} size={80} />
        <ErrorText>{`서버에 문제가 있거나\n네트워크가 불안정해요`}</ErrorText>
        <Sub>잠시 후 다시 이용해주세요</Sub>
        <RestartBtn onPress={() => RNRestart.restart()}>
          <Icon source={icons.initialize_24} />
          <RestartText>재시작</RestartText>
        </RestartBtn>
      </Col>
    </Container>
  );
};

export default ErrorPage;

const ErrorText = styled(TextMain)`
  font-size: 20px;
  margin-top: 40px;
  font-weight: bold;
  text-align: center;
  line-height: 28px;
`;
const Sub = styled(TextSub)`
  font-size: 16px;
  margin-top: 16px;
  line-height: 20px;
`;

const RestartBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 40px;
  padding: 8px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${colors.line};
`;

const RestartText = styled(TextSub)`
  font-size: 16px;
  margin-left: 4px;
  line-height: 22px;
`;
