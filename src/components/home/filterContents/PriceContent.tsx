import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {Row, TextMain} from '../../../styles/styledConsts';
import {useFilterRange, useTest} from '../../../query/queries/product';

import {ProgressBarAndroidComponent, ScrollView} from 'react-native';
import DSlider from '../../common/slider/DSlider';

const PriceContent = props => {
  const priceRange = useFilterRange('price');
  const {data} = priceRange;
  const [priceValue, setPriceValue] = useState<number[]>([0, 25000]);
  const {setPriceParam, priceParam} = props;
  useEffect(() => {
    priceParam && setPriceValue(priceParam);
  }, [priceParam]);

  return (
    <ScrollView>
      <SliderTitle>가격</SliderTitle>
      <DSlider
        sliderValue={priceValue}
        setSliderValue={setPriceValue}
        minimumValue={700}
        maximumValue={25000}
        step={500}
        sliderWidth={SLIDER_WIDTH}
        onSlidingComplete={() => setPriceParam(priceValue)}
      />
    </ScrollView>
  );
};

export default PriceContent;

const Text = styled.Text`
  font-size: 18px;
  margin: 15px;
`;

const BottomText = styled.Text`
  font-size: 16px;
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
const MODAL_INNER_WIDTH = MODAL_WIDTH - 32;
const SLIDER_WIDTH = MODAL_INNER_WIDTH - 32;
