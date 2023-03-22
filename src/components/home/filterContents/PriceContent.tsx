import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {Col, Row, TextMain} from '../../../styles/styledConsts';
import {useFilterRange, useTest} from '../../../query/queries/product';

import {ActivityIndicator, ScrollView} from 'react-native';
import DSlider from '../../common/slider/DSlider';

const PriceContent = props => {
  const {setPriceParam, priceParam, filterParams} = props;
  const priceRange = useFilterRange('price');
  const {data, isLoading} = priceRange;
  const minState = !data?.minData ? 0 : Number(data.minData);
  const maxState = !data?.maxData ? 25000 : Number(data.maxData);

  const initialState = [
    filterParams?.priceParam ? filterParams?.priceParam[0] : 0,
    filterParams?.priceParam ? filterParams?.priceParam[1] : maxState,
  ];
  const getInitialState = () => {
    return initialState;
  };
  const [priceValue, setPriceValue] = useState(() => getInitialState());

  useEffect(() => {
    priceParam && setPriceValue(priceParam);
  }, [priceParam]);

  return (
    <Col style={{marginTop: 120}}>
      <SliderTitle>가격</SliderTitle>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        data && (
          <DSlider
            sliderValue={priceValue}
            setSliderValue={setPriceValue}
            minimumValue={0}
            maximumValue={maxState}
            step={1000}
            text={'원'}
            sliderWidth={SLIDER_WIDTH}
            onSlidingComplete={() => setPriceParam(priceValue)}
          />
        )
      )}
    </Col>
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
