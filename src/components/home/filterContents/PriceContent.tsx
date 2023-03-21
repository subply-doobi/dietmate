import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {Row, TextMain} from '../../../styles/styledConsts';
import {useFilterRange, useTest} from '../../../query/queries/product';

import {ActivityIndicator, ScrollView} from 'react-native';
import DSlider from '../../common/slider/DSlider';

const PriceContent = props => {
  const {setPriceParam, priceParam, filterParams} = props;
  const priceRange = useFilterRange('price');
  const {data, isLoading} = priceRange;
  console.log(isLoading);

  const [priceValue, setPriceValue] = useState([
    filterParams?.priceParam ? filterParams?.priceParam[0] : data?.minData,
    filterParams?.priceParam ? filterParams?.priceParam[1] : data?.maxData,
  ]);
  // useEffect(() => {
  //   priceParam && setPriceValue(priceParam);
  // }, [priceParam]);
  return (
    <ScrollView>
      <SliderTitle>가격</SliderTitle>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <DSlider
          sliderValue={priceValue}
          setSliderValue={setPriceValue}
          minimumValue={Math.floor(data?.minData)}
          maximumValue={Math.floor(data?.maxData)}
          step={500}
          text={'원'}
          sliderWidth={SLIDER_WIDTH}
          onSlidingComplete={() => setPriceParam(priceValue)}
        />
      )}
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
const MODAL_INNER_WIDTH = MODAL_WIDTH;
const SLIDER_WIDTH = MODAL_INNER_WIDTH;
