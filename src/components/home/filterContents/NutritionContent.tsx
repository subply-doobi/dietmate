import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import {
  Row,
  HorizontalLine,
  BtnCTA,
  BtnBottomCTA,
  TextMain,
} from '../../../styles/styledConsts';
import colors from '../../../styles/colors';

import {ProgressBarAndroidComponent, ScrollView} from 'react-native';
import DSlider from '../../common/slider/DSlider';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useFilterRange, useTest} from '../../../query/queries/product';

const NutritionContent = props => {
  const {setNutritionParam, nutritionParam} = props;
  const [clicked, setClicked] = useState(false);
  const [reset, setReset] = useState(false);
  const [calorieValue, setCalorieValue] = useState<number[]>([0, 800]);
  const [carbValue, setCarbrValue] = useState<number[]>([0, 40]);
  const [proteinValue, setProteinValue] = useState<number[]>([0, 40]);
  const [fatValue, setFatValue] = useState<number[]>([0, 40]);
  const params = useMemo(
    () => ({
      calorieParam: calorieValue,
      carbParam: carbValue,
      proteinParam: proteinValue,
      fatParam: fatValue,
    }),
    [calorieValue, carbValue, proteinValue, fatValue],
  );
  // const filterRange = useFilterRange('calorie');
  // console.log('filterRange:', filterRange);

  let kcal = 'kcal';
  let g = 'g';
  useEffect(() => {
    nutritionParam && setCalorieValue(nutritionParam?.calorieParam);
    nutritionParam && setCarbrValue(nutritionParam?.carbParam);
    nutritionParam && setProteinValue(nutritionParam?.proteinParam);
    nutritionParam && setFatValue(nutritionParam?.fatParam);
  }, [nutritionParam]);

  return (
    <SafeAreaView>
      <ScrollView>
        <SliderTitle>칼로리</SliderTitle>
        <DSlider
          sliderValue={calorieValue}
          setSliderValue={setCalorieValue}
          minimumValue={200}
          maximumValue={800}
          step={100}
          sliderWidth={SLIDER_WIDTH}
          kcal={kcal}
          onSlidingComplete={() => setNutritionParam(params)}
        />
        <SliderTitle>탄수화물</SliderTitle>
        <DSlider
          sliderValue={carbValue}
          setSliderValue={setCarbrValue}
          minimumValue={0}
          maximumValue={40}
          step={2}
          sliderWidth={SLIDER_WIDTH}
          g={g}
          onSlidingComplete={() => setNutritionParam(params)}
        />
        <SliderTitle>단백질</SliderTitle>
        <DSlider
          sliderValue={proteinValue}
          setSliderValue={setProteinValue}
          minimumValue={0}
          maximumValue={40}
          step={2}
          sliderWidth={SLIDER_WIDTH}
          g={g}
          onSlidingComplete={() => setNutritionParam(params)}
        />
        <SliderTitle>지방</SliderTitle>
        <DSlider
          sliderValue={fatValue}
          setSliderValue={setFatValue}
          minimumValue={0}
          maximumValue={40}
          step={2}
          sliderWidth={SLIDER_WIDTH}
          g={g}
          onSlidingComplete={() => setNutritionParam(params)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutritionContent;

const Text = styled.Text`
  font-size: 18px;
  margin: 15px;
`;

const BottomText = styled.Text`
  font-size: 16px;
  color: ${colors.white};
`;
const Button = styled.TouchableOpacity``;
const Image = styled.Image`
  width: 24px;
  height: 24px;
`;
const FilterRow = styled(Row)`
  justify-content: center;
`;
const BottomRow = styled.View`
  flex-direction: row;
  justify-content: center;
`;
const SliderTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
`;
const MODAL_WIDTH = 328;
const MODAL_INNER_WIDTH = MODAL_WIDTH;
const SLIDER_WIDTH = MODAL_INNER_WIDTH;
