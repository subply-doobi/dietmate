import styled from 'styled-components/native';
import {Col, TextMain} from '../../../shared/ui/styledConsts';
import colors from '../../../shared/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';
import {updateSelectedBtn} from '../../../features/reduxSlices/sortFilterSlice';
import {commaToNum} from '../../../shared/utils/sumUp';

const checkIsPressed = (selectedBtn: number[], currentBtn: number) => {
  if (selectedBtn.length === 0) return false;
  if (selectedBtn.length === 1) return selectedBtn[0] === currentBtn;

  return selectedBtn[0] <= currentBtn && currentBtn <= selectedBtn[1];
};

const RangeBtn = ({
  btn,
  btnIdx,
}: {
  btn: {name: string; label: string; value: number[][]};
  btnIdx: number;
}) => {
  // redux
  const dispatch = useDispatch();
  const {
    copied: {
      filter: {selectedBtn},
    },
  } = useSelector((state: RootState) => state.sortFilter);

  /** name => "calorie" | "carb" | "protein" | "fat"  ||
   * btnIdx => 범위 버튼 (0~20 | 20~40) etc */
  const handleBtnOnPress = (name: string, btnIdx: number) => {
    dispatch(updateSelectedBtn({[name]: btnIdx}));
  };

  return (
    <Col>
      <Label>{btn.label}</Label>
      <BtnContainer>
        {btn.value.map((b, i) => {
          const isPressed = checkIsPressed(selectedBtn[btn.name], i);
          return (
            <Btn
              key={i}
              isActivated={isPressed}
              onPress={() => handleBtnOnPress(btn.name, i)}>
              <BtnText isActivated={isPressed}>{`${commaToNum(
                b[0],
              )}~${commaToNum(b[1])}`}</BtnText>
            </Btn>
          );
        })}
      </BtnContainer>
    </Col>
  );
};

export default RangeBtn;

const Label = styled(TextMain)`
  font-size: 16px;
`;

const BtnContainer = styled.View`
  margin-top: 16px;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Btn = styled.TouchableOpacity`
  width: 72px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${({isActivated}: {isActivated: boolean}) =>
    isActivated ? colors.main : colors.inactivated};
  background-color: ${colors.white};
`;

const BtnText = styled(TextMain)`
  font-size: 11px;
  color: ${({isActivated}: {isActivated: boolean}) =>
    isActivated ? colors.textMain : colors.textSub};
`;
