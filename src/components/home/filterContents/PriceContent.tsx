import React, {useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';

import {Col, TextMain} from '../../../styles/StyledConsts';
import DSlider from '../../common/slider/DSlider';

import {useFilterRange} from '../../../query/queries/product';

interface Props {
  setPriceParam: (param: any) => void;
  priceParam: [number, number];
  filterParams: {
    priceParam: [number, number];
    nutritionParam: {
      calorieParam: [number, number];
      carbParam: [number, number];
      fatParam: [number, number];
      proteinParam: [number, number];
    };
    categoryParam: {
      category: string;
    };
  };
}

const PriceContent = (props: Props) => {
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
    if (!priceParam) {
      return setPriceValue([0, maxState]);
    }
  }, [priceParam, maxState]);

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

const SliderTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
`;
const MODAL_WIDTH = 328;
const MODAL_INNER_WIDTH = MODAL_WIDTH;
const SLIDER_WIDTH = MODAL_INNER_WIDTH;
