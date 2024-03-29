import styled from 'styled-components/native';

import {Col, TextMain} from '../../../styles/styledConsts';

const CommonAlertContent = ({text}: {text: string}) => {
  return (
    <Container>
      <Col style={{marginTop: 28, alignItems: 'center'}}>
        <AlertText>{text}</AlertText>
      </Col>
    </Container>
  );
};

export default CommonAlertContent;

const Container = styled.View`
  padding: 0px 16px 24px 16px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  text-align: center;
`;
