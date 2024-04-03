// RN
import {useRef} from 'react';

// 3rd
import styled from 'styled-components/native';
import {useDispatch} from 'react-redux';

// doobi
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';
import SquareInput from '../../../../shared/ui/SquareInput';
import {useListCode} from '../../../../shared/api/queries/code';
import {getRecommendedNutr} from '../../util/targetByUserInfo';
import {Col, TextMain, TextSub} from '../../../../shared/ui/styledComps';
import colors from '../../../../shared/colors';
import {calculateManualCalorie} from '../../../../shared/utils/targetCalculation';

const TargetManual = ({userInputState}: {userInputState: IUserInputState}) => {
  // redux
  const dispatch = useDispatch();
  const {carb, protein, fat} = userInputState;

  // react-query
  const {data: seqCodeData} = useListCode('SP008'); // SP008 : 운동빈도 (sportsSeqCd)
  const {data: timeCodeData} = useListCode('SP009'); // SP009 : 운동시간 (sportsTimeCd)
  const {data: strengthCodeData} = useListCode('SP010'); // SP010 : 운동강도 (sportsStrengthCd)

  // 권장영양
  const {
    calorie: calorieAuto,
    carb: carbAuto,
    protein: proteinAuto,
    fat: fatAuto,
    tmr,
  } = getRecommendedNutr(
    seqCodeData,
    timeCodeData,
    strengthCodeData,
    userInputState,
  );

  // useRef
  const inputRef = useRef([]);

  // 영양소
  const {totalCalorie} = calculateManualCalorie(
    carb.value,
    protein.value,
    fat.value,
  );
  const nutrItems = [
    {name: '칼로리', value: totalCalorie, unit: 'kcal'},
    {name: '탄수화물', value: carb.value, unit: 'g'},
    {name: '단백질', value: protein.value, unit: 'g'},
    {name: '지방', value: fat.value, unit: 'g'},
  ];
  return (
    <Container>
      <SquareInput
        isActive={!!carb.value}
        label={`탄수화물 양 (권장: ${carbAuto}g)`}
        value={carb.value}
        onChangeText={v => dispatch(setValue({name: 'carb', value: v}))}
        errMsg={carb.errMsg}
        keyboardType="numeric"
        maxLength={3}
        placeholder={`탄수화물 양을 입력해주세요 (권장: ${carbAuto}g)`}
        onSubmitEditing={() => inputRef.current[0]?.focus()}
      />
      <SquareInput
        isActive={!!protein.value}
        label={`단백질 양 (권장: ${proteinAuto}g)`}
        value={protein.value}
        onChangeText={v => dispatch(setValue({name: 'protein', value: v}))}
        errMsg={protein.errMsg}
        keyboardType="numeric"
        maxLength={3}
        placeholder={`단백질 양을 입력해주세요 (권장: ${proteinAuto}g)`}
        boxStyle={{marginTop: 4}}
        ref={el => {
          inputRef ? (inputRef.current[0] = el) : null;
        }}
        onSubmitEditing={() => inputRef.current[1]?.focus()}
      />
      <SquareInput
        isActive={!!fat.value}
        label={`지방 양 (권장: ${fatAuto}g)`}
        value={fat.value}
        onChangeText={v => dispatch(setValue({name: 'fat', value: v}))}
        errMsg={fat.errMsg}
        keyboardType="numeric"
        maxLength={3}
        placeholder={`지방 양을 입력해주세요 (권장: ${fatAuto}g)`}
        boxStyle={{marginTop: 4}}
        ref={el => {
          inputRef ? (inputRef.current[1] = el) : null;
        }}
      />
      <NutrBox>
        {nutrItems.map((item, idx) => (
          <Col key={item.name} style={{flex: 1, alignItems: 'center'}}>
            <NutrTitle>{item.name}</NutrTitle>
            <NutrValue>{`${item.value} ${item.unit}`}</NutrValue>
          </Col>
        ))}
      </NutrBox>
    </Container>
  );
};

export default TargetManual;

const Container = styled.View`
  flex: 1;
`;

const NutrBox = styled.View`
  width: 100%;
  height: 58px;
  flex-direction: row;

  border-color: ${colors.main};
  border-width: 1px;
  border-radius: 5px;

  align-items: center;
  justify-content: space-between;

  margin-top: 24px;
`;

const NutrTitle = styled(TextSub)`
  font-size: 12px;
`;
const NutrValue = styled(TextMain)`
  font-size: 12px;
  margin-top: 2px;
`;
