import {useEffect, useState} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import {filterBtnRange} from '../../../constants/constants';
import colors from '../../../styles/colors';
import {Col, StyledProps, TextMain} from '../../../styles/styledConsts';
import {setInitialIdx} from '../../../util/home/filterUtils';

interface INutritionContent2 {
  setNutritionParam: React.Dispatch<React.SetStateAction<any>>;
  nutritionParam: any;
  filterParams: any;
}
const NutritionContent2 = ({
  setNutritionParam,
  nutritionParam,
  filterParams,
}: INutritionContent2) => {
  // etc

  // state
  interface INutrRange {
    [key: string]: number[];
  }
  const [nutrIdxRange, setNutrIdxRange] = useState<INutrRange>({
    calorie: [],
    carb: [],
    protein: [],
    fat: [],
  });

  // useEffect
  useEffect(() => {
    setInitialIdx(filterParams, setNutrIdxRange);
  }, [nutritionParam]);

  // etc
  const checkIsActivated = (nutrIdx: number, btnIdx: number) => {
    const nutrIdxToName = ['calorie', 'carb', 'protein', 'fat'];
    if (nutrIdxRange[nutrIdxToName[nutrIdx]].length === 0) return false;
    if (nutrIdxRange[nutrIdxToName[nutrIdx]].length === 1) {
      return nutrIdxRange[nutrIdxToName[nutrIdx]][0] === btnIdx;
    }
    if (nutrIdxRange[nutrIdxToName[nutrIdx]].length === 2) {
      return (
        nutrIdxRange[nutrIdxToName[nutrIdx]][0] <= btnIdx &&
        btnIdx <= nutrIdxRange[nutrIdxToName[nutrIdx]][1]
      );
    }
  };

  const btnOnPress = (nutrIdx: number, btnIdx: number) => {
    const nutrIdxToName = ['calorie', 'carb', 'protein', 'fat'];

    if (nutrIdxRange[nutrIdxToName[nutrIdx]].length === 1) {
      console.log('btnOnPress: nutritionParam', nutritionParam);
      if (btnIdx === nutrIdxRange[nutrIdxToName[nutrIdx]][0]) {
        setNutrIdxRange(prev => {
          return {
            ...prev,
            calorie: [...prev.calorie],
            carb: [...prev.carb],
            protein: [...prev.protein],
            fat: [...prev.fat],
            [nutrIdxToName[nutrIdx]]: [],
          };
        });
        // setNutritionParam(prev => ({
        //   ...prev,
        //   calorieParam: [...prev.calorieParam],
        //   carbParam: [...prev.carbParam],
        //   proteinParam: [...prev.proteinParam],
        //   fatParam: [...prev.fatParam],
        //   [`${nutrIdxToName[nutrIdx]}Param`]: [],
        // }));
      } else {
        console.log('btnOnPress: nutritionParam', nutritionParam);
        const newNutrIdxRange =
          btnIdx < nutrIdxRange[nutrIdxToName[nutrIdx]][0]
            ? [btnIdx, nutrIdxRange[nutrIdxToName[nutrIdx]][0]]
            : [nutrIdxRange[nutrIdxToName[nutrIdx]][0], btnIdx];

        setNutrIdxRange(prev => {
          return {
            ...prev,
            calorie: [...prev.calorie],
            carb: [...prev.carb],
            protein: [...prev.protein],
            fat: [...prev.fat],
            [nutrIdxToName[nutrIdx]]: newNutrIdxRange,
          };
        });
        // setNutritionParam(prev => ({
        //   ...prev,
        //   calorieParam: [...prev.calorieParam],
        //   carbParam: [...prev.carbParam],
        //   proteinParam: [...prev.proteinParam],
        //   fatParam: [...prev.fatParam],
        //   [`${nutrIdxToName[nutrIdx]}Param`]: [
        //     filterBtnRange[nutrIdx].value[newNutrIdxRange[0]][0],
        //     filterBtnRange[nutrIdx].value[newNutrIdxRange[1]][1],
        //   ],
        // }));
      }
    } else {
      console.log('btnOnPress: nutritionParam', nutritionParam);
      setNutrIdxRange(prev => {
        return {
          ...prev,
          calorie: [...prev.calorie],
          carb: [...prev.carb],
          protein: [...prev.protein],
          fat: [...prev.fat],
          [nutrIdxToName[nutrIdx]]: [btnIdx],
        };
      });
      // setNutritionParam(prev => ({
      //   ...prev,
      //   calorieParam: [...prev.calorieParam],
      //   carbParam: [...prev.carbParam],
      //   proteinParam: [...prev.proteinParam],
      //   fatParam: [...prev.fatParam],
      //   [`${nutrIdxToName[nutrIdx]}Param`]: [
      //     ...filterBtnRange[nutrIdx].value[btnIdx],
      //   ],
      // }));
    }
  };
  console.log('NutritionContent2: nutrIdx', nutrIdxRange);
  return (
    <TouchableWithoutFeedback>
      <Container>
        {filterBtnRange.map((nutr, nutrIdx) => (
          <Col key={nutr.label}>
            <Nutr>{nutr.label}</Nutr>
            <BtnContainer>
              {nutr.value.map((btn, btnIdx) => (
                <Btn
                  key={btnIdx}
                  isActivated={checkIsActivated(nutrIdx, btnIdx)}
                  onPress={() => btnOnPress(nutrIdx, btnIdx)}>
                  <BtnText>{`${btn[0]}~${btn[1]}`}</BtnText>
                </Btn>
              ))}
            </BtnContainer>
          </Col>
        ))}
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default NutritionContent2;

const Container = styled.View`
  row-gap: 64px;
`;

const Nutr = styled(TextMain)`
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
  border-color: ${colors.inactivated};
  background-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.inactivated : colors.white};
`;

const BtnText = styled(TextMain)`
  font-size: 14px;
`;
