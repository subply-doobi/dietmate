// RN, 3rd
import React, {useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';

import {Col, TextMain} from '../../../styles/StyledConsts';
import DSlider from '../../common/slider/DSlider';
// react-query
import {useFilterRange} from '../../../query/queries/product';
import {IFilterParams} from '../../../query/types/product';

interface Props {
  setPriceParam: (param: any) => void;
  priceParam: number[];
  filterParams: IFilterParams;
}

const PriceContent = (props: Props) => {
  const {setPriceParam, priceParam, filterParams} = props;
  //price range
  const priceRange = useFilterRange('price');
  const {data, isLoading} = priceRange;
  //price min, max
  const minState = !data?.minData ? 0 : Number(data.minData);
  const maxState = !data?.maxData ? 25000 : Number(data.maxData);

  const [priceValue, setPriceValue] = useState<number[]>([]);
  console.log('priceValue', priceValue);
  useEffect(() => {
    const initialState =
      filterParams.priceParam.length === 0
        ? [0, maxState]
        : filterParams.priceParam;
    setPriceValue(initialState);
  }, [data]);

  useEffect(() => {
    priceParam.length === 0 && setPriceValue([0, maxState]);
  }, [priceParam]);

  return (
    <Col style={{marginTop: 120}}>
      <SliderTitle>가격</SliderTitle>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        priceValue.length === 2 && (
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
