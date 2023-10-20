import {useEffect, useState} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import {filterBtnRange} from '../../../constants/constants';
import colors from '../../../styles/colors';
import {Col, StyledProps, TextMain} from '../../../styles/StyledConsts';
import {setInitialIdx} from '../../../util/home/filterUtils';
import {IFilterParams} from '../../../query/types/product';

interface INutritionContent {
  setNutritionParam: React.Dispatch<
    React.SetStateAction<{
      calorieParam: number[];
      carbParam: number[];
      fatParam: number[];
      proteinParam: number[];
    }>
  >;
  nutritionParam: {
    calorieParam: number[];
    carbParam: number[];
    fatParam: number[];
    proteinParam: number[];
  };
  filterParams: IFilterParams;
}
const NutritionContent = ({
  setNutritionParam,
  nutritionParam,
  filterParams,
}: INutritionContent) => {
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
    // console.log('NutritionContent2: useEffect: filterParams', filterParams);
    setInitialIdx(filterParams, setNutrIdxRange);
  }, [filterParams]);
  useEffect(() => {
    if (
      nutritionParam.calorieParam.length !== 0 ||
      nutritionParam.carbParam.length !== 0 ||
      nutritionParam.fatParam.length !== 0 ||
      nutritionParam.proteinParam.length !== 0
    )
      return;
    setNutrIdxRange({
      calorie: [],
      carb: [],
      protein: [],
      fat: [],
    });
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

    // 버튼 하나 "눌려있을" 때
    if (nutrIdxRange[nutrIdxToName[nutrIdx]].length === 1) {
      // 버튼 누른 것이 기존 것과 같을 때
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
        setNutritionParam(prev => ({
          ...prev,
          calorieParam: [...prev.calorieParam],
          carbParam: [...prev.carbParam],
          proteinParam: [...prev.proteinParam],
          fatParam: [...prev.fatParam],
          [`${nutrIdxToName[nutrIdx]}Param`]: [],
        }));

        // 버튼 누른 것이 기존 것과 다를 때
      } else {
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
        setNutritionParam(prev => ({
          ...prev,
          calorieParam: [...prev.calorieParam],
          carbParam: [...prev.carbParam],
          proteinParam: [...prev.proteinParam],
          fatParam: [...prev.fatParam],
          [`${nutrIdxToName[nutrIdx]}Param`]: [
            filterBtnRange[nutrIdx].value[newNutrIdxRange[0]][0],
            filterBtnRange[nutrIdx].value[newNutrIdxRange[1]][1] - 0.1,
          ],
        }));
      }

      // 버튼 둘 이상 or 하나도 안 "눌려있을" 때
    } else {
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
      setNutritionParam(prev => {
        return {
          ...prev,
          calorieParam: [...prev.calorieParam],
          carbParam: [...prev.carbParam],
          proteinParam: [...prev.proteinParam],
          fatParam: [...prev.fatParam],
          [`${nutrIdxToName[nutrIdx]}Param`]: [
            filterBtnRange[nutrIdx].value[btnIdx][0],
            filterBtnRange[nutrIdx].value[btnIdx][1] - 0.1,
          ],
        };
      });
    }
  };
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

export default NutritionContent;

const Container = styled.View`
  row-gap: 64px;
  margin-top: 48px;
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
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
  background-color: ${colors.white};
`;

const BtnText = styled(TextMain)`
  font-size: 14px;
`;
