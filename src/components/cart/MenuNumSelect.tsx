import styled from 'styled-components/native';
import colors from '../../styles/colors';
import {TextMain} from '../../styles/styledConsts';
import {icons} from '../../assets/icons/iconSource';

/** dummy인 경우 수량조절 bottomSheet 열어주고 아닌 경우 실제 수량조절 */
const MenuNumSelect = ({
  isForOpenModal,
  disabled = false,
  openMenuNumSelect,
  setQty,
  currentQty,
}: {
  isForOpenModal: boolean;
  disabled?: boolean;
  openMenuNumSelect?: Function;
  setQty?: React.Dispatch<React.SetStateAction<number>>;
  currentQty: number;
}) => {
  // etc
  // 버튼 상태 (dummy 버튼인지, 전체 disabled 상태인지에 따라)
  // 전체 버튼 | +/- 버튼 상태 결정
  const isBtnBoxDisabled = disabled || !isForOpenModal;
  const isPlusMinusBtnDisabled = disabled || isForOpenModal;
  return (
    <Box
      onPress={() =>
        isForOpenModal && !!openMenuNumSelect && openMenuNumSelect()
      }
      disabled={isBtnBoxDisabled}>
      <PlusMinusBtn
        style={{borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}
        disabled={isPlusMinusBtnDisabled}
        onPress={() => !!setQty && setQty(v => (v <= 1 ? v : v - 1))}>
        <PlusMinusImg source={icons.minusGrey_24} />
      </PlusMinusBtn>
      <MenuNoBox>
        <MenuNo>{currentQty}</MenuNo>
      </MenuNoBox>
      <PlusMinusBtn
        style={{borderTopRightRadius: 5, borderBottomRightRadius: 5}}
        disabled={isPlusMinusBtnDisabled}
        onPress={() => !!setQty && setQty(v => v + 1)}>
        <PlusMinusImg source={icons.plusGrey_24} />
      </PlusMinusBtn>
    </Box>
  );
};

export default MenuNumSelect;

const Box = styled.TouchableOpacity`
  flex-direction: row;

  align-items: center;
  height: 32px;
  justify-content: space-between;
`;

const PlusMinusBtn = styled.TouchableOpacity`
  width: 30px;
  height: 32px;
  justify-content: center;
  align-items: center;

  background-color: ${colors.backgroundLight2};
  border-color: ${colors.lineLight};
  border-width: 1px;
`;

const PlusMinusImg = styled.Image`
  width: 24px;
  height: 24px;
`;

const MenuNoBox = styled.View`
  width: 44px;
  height: 32px;
  background-color: ${colors.white};
  border-width: 1px;
  border-color: ${colors.lineLight};
  justify-content: center;
  align-items: center;
`;

const MenuNo = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;
