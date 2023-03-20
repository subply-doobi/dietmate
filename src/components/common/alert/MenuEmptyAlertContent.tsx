import styled from 'styled-components/native';
import {Col, TextMain} from '../../../styles/styledConsts';

const MenuEmptyAlertContent = () => {
  return (
    <Container>
      <Col style={{marginTop: 28, alignItems: 'center'}}>
        <AlertText>{`비어있는 끼니를 `}</AlertText>
        <AlertText>{`먼저 구성하고 이용해보세요`}</AlertText>
      </Col>
    </Container>
  );
};

export default MenuEmptyAlertContent;

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
`;
