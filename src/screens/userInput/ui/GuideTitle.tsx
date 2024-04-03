import {ViewProps} from 'react-native';
import {TextMain, TextSub} from '../../../shared/ui/styledComps';
import styled from 'styled-components/native';

interface IGuideTitle extends ViewProps {
  title: string;
  subTitle: string;
}
const GuideTitle = ({title, subTitle, ...props}: IGuideTitle) => {
  return (
    <Box {...props}>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
    </Box>
  );
};

export default GuideTitle;

const Box = styled.View`
  width: 100%;
  align-items: flex-start;
`;

const Title = styled(TextMain)`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
`;

const SubTitle = styled(TextSub)`
  width: 100%;
  font-size: 16px;
  margin-top: 16px;
`;
