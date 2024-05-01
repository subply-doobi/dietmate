import styled from 'styled-components/native';
import {TextMain} from '../../../shared/ui/styledComps';
import colors from '../../../shared/colors';
import {IDietDetailData} from '../../../shared/api/types/diet';
import {TouchableOpacityProps, ViewProps} from 'react-native';

interface IAddMenuBtn extends TouchableOpacityProps {
  dTData: IDietDetailData[];
}
const AddMenuBtn = ({dTData, ...props}: IAddMenuBtn) => (
  <Btn {...props}>
    <BtnBar isActive={dTData?.length === 0} />
    <BtnText>끼니 추가</BtnText>
  </Btn>
);

export default AddMenuBtn;

const Btn = styled.TouchableOpacity`
  width: 100%;
  height: 48px;
  background-color: ${colors.white};
  border-radius: 5px;

  justify-content: center;
  align-items: center;

  margin-top: 4px;
`;

const BtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
`;
const BtnBar = styled.View<{isActive: boolean}>`
  width: 4px;
  height: 48px;
  position: absolute;
  left: 0px;
  background-color: ${({isActive}) =>
    isActive ? colors.main : colors.inactivated};

  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;
