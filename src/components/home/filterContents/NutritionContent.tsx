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
  const calorieRange = useFilterRange('calorie');
  const carbRange = useFilterRange('carb');
  const fatRange = useFilterRange('fat');
  const proteinRange = useFilterRange('protein');
  const {setNutritionParam, nutritionParam, filterParams} = props;
  const minCalorie = Math.floor(calorieRange?.data?.minData);
  const maxCalorie = Math.floor(calorieRange?.data?.maxData);
  const minCarb = Math.floor(carbRange?.data?.minData);
  const maxCarb = Math.floor(carbRange?.data?.maxData);
  const minProtein = Math.floor(proteinRange?.data?.minData);
  const maxProtein = Math.floor(proteinRange?.data?.maxData);
  const minFat = Math.floor(fatRange?.data?.minData);
  const maxFat = Math.floor(fatRange?.data?.maxData);
  const [calorieValue, setCalorieValue] = useState([
    filterParams.nutritionParam?.calorieParam
      ? filterParams.nutritionParam?.calorieParam[0]
      : Math.floor(minCalorie),
    filterParams.nutritionParam?.calorieParam
      ? filterParams.nutritionParam?.calorieParam[1]
      : Math.floor(maxCalorie),
  ]);
  const [carbValue, setCarbrValue] = useState([
    filterParams.nutritionParam?.carbParam
      ? filterParams.nutritionParam?.carbParam[0]
      : Math.floor(minCarb),
    filterParams.nutritionParam?.carbParam
      ? filterParams.nutritionParam?.carbParam[1]
      : Math.floor(maxCarb),
  ]);
  const [proteinValue, setProteinValue] = useState([
    filterParams.nutritionParam?.proteinParam
      ? filterParams.nutritionParam?.proteinParam[0]
      : Math.floor(minProtein),
    filterParams.nutritionParam?.proteinParam
      ? filterParams.nutritionParam?.proteinParam[1]
      : Math.floor(maxProtein),
  ]);
  const [fatValue, setFatValue] = useState([
    filterParams.nutritionParam?.fatParam
      ? filterParams.nutritionParam?.fatParam[0]
      : Math.floor(minFat),
    filterParams.nutritionParam?.fatParam
      ? filterParams.nutritionParam?.fatParam[1]
      : Math.floor(maxFat),
  ]);
  const params = useMemo(
    () => ({
      calorieParam: calorieValue,
      carbParam: carbValue,
      proteinParam: proteinValue,
      fatParam: fatValue,
    }),
    [calorieValue, carbValue, proteinValue, fatValue],
  );

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
          minimumValue={calorieRange.isLoading ? 0 : Math.floor(minCalorie)}
          maximumValue={calorieRange.isLoading ? 1 : Math.floor(maxCalorie)}
          step={1}
          sliderWidth={SLIDER_WIDTH}
          text={'kcal'}
          onSlidingComplete={() => setNutritionParam(params)}
        />
        <SliderTitle>탄수화물</SliderTitle>
        <DSlider
          sliderValue={carbValue}
          setSliderValue={setCarbrValue}
          minimumValue={carbRange.isLoading ? 0 : Math.floor(minCarb)}
          maximumValue={carbRange.isLoading ? 1 : Math.floor(maxCarb)}
          step={1}
          sliderWidth={SLIDER_WIDTH}
          text={'g'}
          onSlidingComplete={() => setNutritionParam(params)}
        />
        <SliderTitle>단백질</SliderTitle>
        <DSlider
          sliderValue={proteinValue}
          setSliderValue={setProteinValue}
          minimumValue={proteinRange.isLoading ? 0 : Math.floor(minProtein)}
          maximumValue={proteinRange.isLoading ? 1 : Math.floor(maxProtein)}
          step={1}
          sliderWidth={SLIDER_WIDTH}
          text={'g'}
          onSlidingComplete={() => setNutritionParam(params)}
        />
        <SliderTitle>지방</SliderTitle>
        <DSlider
          sliderValue={fatValue}
          setSliderValue={setFatValue}
          minimumValue={fatRange.isLoading ? 0 : Math.floor(minFat)}
          maximumValue={fatRange.isLoading ? 1 : Math.floor(maxFat)}
          step={1}
          sliderWidth={SLIDER_WIDTH}
          text={'g'}
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
