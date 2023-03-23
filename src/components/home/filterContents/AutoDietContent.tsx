import styled from 'styled-components/native';

import {icons} from '../../../assets/icons/iconSource';
import colors from '../../../styles/colors';
import {Col} from '../../../styles/styledConsts';

import DTooltip from '../../common/DTooltip';

const AutoDietContent = () => {
  return (
    <>
      <Container>
        <Text>현재 식단 기준으로 목표섭취량을 초과하지 않는</Text>
        <Text>무작위 5개 식품들만 보여줍니다.</Text>
      </Container>
      <Col>
        <Button>
          <CheckboxImage source={icons.checkbox_24} />
          <ButtonText>식단구성 쉽게하기</ButtonText>
        </Button>
        <DTooltip
          tooltipShow={true}
          text={'영양성분 필터는 초기화됩니다'}
          boxBottom={32}
          triangleLeft={12}
        />
      </Col>
    </>
  );
};

export default AutoDietContent;

const Container = styled.View`
  margin-top: 64px;
`;

const Text = styled.Text`
  font-size: 16px;
  color: ${colors.textMain};
`;
const Button = styled.TouchableOpacity`
  margin-top: 118px;
  flex-direction: row;
`;
const ButtonText = styled.Text`
  font-size: 18px;
  color: ${colors.textMain};
  font-weight: bold;
  margin-left: 8px;
`;
const CheckboxImage = styled.Image`
  width: 24px;
  height: 24px;
`;
