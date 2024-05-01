import styled from 'styled-components/native';
import {TextMain} from '../../../shared/ui/styledComps';

const ErrorAlertContent = () => {
  return (
    <Box>
      <AlertText>{`오류가 발생했어요\n계속되면 문의 부탁드려요`}</AlertText>
    </Box>
  );
};

export default ErrorAlertContent;

const Box = styled.View`
  justify-content: center;
  align-items: center;
  padding: 28px 0px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  margin-bottom: 24px;
`;
