import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Row, TextMain} from '../../../styles/styledConsts';

import {ProgressBarAndroidComponent, ScrollView} from 'react-native';
import DSlider from '../../common/slider/DSlider';

const PriceContent = () => {
  const [sliderValue, setSliderValue] = useState<number[]>([4000, 12000]);

  return (
    <ScrollView>
      <SliderTitle>가격</SliderTitle>
      <DSlider
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        minimumValue={4000}
        maximumValue={12000}
        step={1000}
        sliderWidth={SLIDER_WIDTH}
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
