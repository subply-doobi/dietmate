import React, {useState, useEffect, useMemo} from 'react';
import {ScrollView, TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';

import {TextMain, Col} from '../../../styles/styledConsts';
import DSlider from '../../common/slider/DSlider';

import {useFilterRange} from '../../../query/queries/product';

const NutritionContent = props => {
  const calorieRange = useFilterRange('calorie');
  const carbRange = useFilterRange('carb');
  const fatRange = useFilterRange('fat');
  const proteinRange = useFilterRange('protein');
  const {setNutritionParam, nutritionParam, filterParams} = props;

  //calorie
  const minCalorie = !calorieRange?.data
    ? 20
    : Number(Math.floor(calorieRange?.data?.minData));
  const maxCalorie = !calorieRange?.data
    ? 457
    : Number(Math.floor(calorieRange?.data?.maxData));
  const calorieInitialState = [
    filterParams.nutritionParam?.calorieParam
      ? filterParams.nutritionParam?.calorieParam[0]
      : minCalorie,
    filterParams.nutritionParam?.calorieParam
      ? filterParams.nutritionParam?.calorieParam[1]
      : maxCalorie,
  ];
  //carb
  const minCarb = !carbRange?.data
    ? 0
    : Number(Math.floor(carbRange?.data?.minData));
  const maxCarb = !carbRange?.data
    ? 77
    : Number(Math.floor(carbRange?.data?.maxData));
  const carbInitialState = [
    filterParams.nutritionParam?.carbParam
      ? filterParams.nutritionParam?.carbParam[0]
      : minCarb,
    filterParams.nutritionParam?.carbParam
      ? filterParams.nutritionParam?.carbParam[1]
      : maxCarb,
  ];

  //protein
  const minProtein = !proteinRange?.data
    ? 1
    : Number(Math.floor(proteinRange?.data?.minData));
  const maxProtein = !proteinRange?.data
    ? 41
    : Number(Math.floor(proteinRange?.data?.maxData));
  const proteinInitialState = [
    filterParams.nutritionParam?.proteinParam
      ? filterParams.nutritionParam?.proteinParam[0]
      : minProtein,
    filterParams.nutritionParam?.proteinParam
      ? filterParams.nutritionParam?.proteinParam[1]
      : maxProtein,
  ];

  //fat
  const minFat = !fatRange?.data
    ? 0
    : Number(Math.floor(fatRange?.data?.minData));
  const maxFat = !fatRange?.data
    ? 19
    : Number(Math.floor(fatRange?.data?.maxData));
  const fatInitialState = [
    filterParams.nutritionParam?.fatParam
      ? filterParams.nutritionParam?.fatParam[0]
      : minFat,
    filterParams.nutritionParam?.fatParam
      ? filterParams.nutritionParam?.fatParam[1]
      : maxFat,
  ];

  const [calorieValue, setCalorieValue] = useState(calorieInitialState);
  const [carbValue, setCarbrValue] = useState(carbInitialState);
  const [proteinValue, setProteinValue] = useState(proteinInitialState);
  const [fatValue, setFatValue] = useState(fatInitialState);

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
    <ScrollView>
      <TouchableWithoutFeedback>
        <Col>
          <SliderTitle>칼로리</SliderTitle>
          <DSlider
            sliderValue={calorieValue}
            setSliderValue={setCalorieValue}
            minimumValue={minCalorie}
            maximumValue={maxCalorie}
            step={calorieValue[1] - calorieValue[0] > 50 ? 1 : 50}
            sliderWidth={SLIDER_WIDTH}
            text={'kcal'}
            onSlidingComplete={() => setNutritionParam(params)}
          />
          <SliderTitle>탄수화물</SliderTitle>
          <DSlider
            sliderValue={carbValue}
            setSliderValue={setCarbrValue}
            minimumValue={minCarb}
            maximumValue={maxCarb}
            step={carbValue[1] - carbValue[0] > 10 ? 1 : 10}
            sliderWidth={SLIDER_WIDTH}
            text={'g'}
            onSlidingComplete={() => setNutritionParam(params)}
          />
          <SliderTitle>단백질</SliderTitle>
          <DSlider
            sliderValue={proteinValue}
            setSliderValue={setProteinValue}
            minimumValue={minProtein}
            maximumValue={maxProtein}
            step={proteinValue[1] - proteinValue[0] > 5 ? 1 : 5}
            sliderWidth={SLIDER_WIDTH}
            text={'g'}
            onSlidingComplete={() => setNutritionParam(params)}
          />
          <SliderTitle>지방</SliderTitle>
          <DSlider
            sliderValue={fatValue}
            setSliderValue={setFatValue}
            minimumValue={minFat}
            maximumValue={maxFat}
            step={fatValue[1] - fatValue[0] > 2 ? 1 : 2}
            sliderWidth={SLIDER_WIDTH}
            text={'g'}
            onSlidingComplete={() => setNutritionParam(params)}
          />
        </Col>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default NutritionContent;

const SliderTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
`;
const MODAL_WIDTH = 328;
const MODAL_INNER_WIDTH = MODAL_WIDTH;
const SLIDER_WIDTH = MODAL_INNER_WIDTH;
