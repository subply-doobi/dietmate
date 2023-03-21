import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {icons} from '../../assets/icons/iconSource';

import {BtnCTA, Row, TextSub} from '../../styles/styledConsts';

const GuideText = styled(TextSub)`
  margin-top: 24px;
  font-size: 14px;
`;

const PlusBtnImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const AutoMenuText = styled(TextSub)`
  margin-left: 8px;
  font-size: 14px;
`;

const AutoMenuBtn = ({
  status,
  onPress,
}: {
  status: 'empty' | 'notEnough' | 'exceed';
  onPress: Function;
}) => {
  const btnHeight = status === 'empty' ? 108 : 48;
  const btnMarginTop = status === 'empty' ? 8 : 16;
  const btnStyle = status === 'empty' ? 'borderActivated' : 'border';
  const btnText =
    status === 'empty' ? '귀찮을 땐 자동구성' : '남은 영양만큼 자동구성';
  const btnImageRequire =
    status === 'empty' ? icons.plusSquareActivated_24 : icons.plusSquare_24;
  return (
    <View>
      {status === 'empty' && <GuideText>식품을 추가해보세요</GuideText>}
      {status !== 'exceed' && (
        <BtnCTA
          height={btnHeight}
          btnStyle={btnStyle}
          style={{marginTop: btnMarginTop}}
          onPress={() => onPress()}>
          <Row>
            <PlusBtnImage source={btnImageRequire} />
            <AutoMenuText>{btnText}</AutoMenuText>
          </Row>
        </BtnCTA>
      )}
    </View>
  );
};

export default AutoMenuBtn;
