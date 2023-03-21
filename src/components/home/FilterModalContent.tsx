import React, {useState, useCallback, useMemo, useEffect, View} from 'react';
import styled from 'styled-components/native';
import {
  Row,
  HorizontalLine,
  BtnCTA,
  BtnBottomCTA,
  TextMain,
  StickyFooter,
  HorizontalSpace,
} from '../../styles/styledConsts';
import {SafeAreaView} from 'react-native-safe-area-context';

import colors from '../../styles/colors';
import {useWeightPurposeCode, useFilterCode} from '../../query/queries/code';
import {useListProduct} from '../../query/queries/product';
import {useListCategory, useCountCategory} from '../../query/queries/category';
import {ProgressBarAndroidComponent, ScrollView} from 'react-native';
import DSlider from '../common/slider/DSlider';

import CategoryContent from './filterContents/CategoryContent';
import NutritionContent from './filterContents/NutritionContent';
import PriceContent from './filterContents/PriceContent';
import {icons} from '../../assets/icons/iconSource';
import AutoDietContent from './filterContents/AutoDietContent';

const FilterModalContent = props => {
  const {filterIndex, closeModal, setFilterParams, filterParams} = props;
  const [clicked, setClicked] = useState(filterIndex);
  const [categoryParam, setCategoryParam] = useState(
    filterParams.categoryParam,
  );
  const [nutritionParam, setNutritionParam] = useState('');
  const [priceParam, setPriceParam] = useState('');
  const params = {
    categoryParam,
    nutritionParam,
    priceParam,
  };
  const resetType = [
    {
      text: '카테고리 초기화',
      reset: () => {
        setCategoryParam('');
        setFilterParams({...filterParams, categoryParam: ''});
      },
    },
    {
      text: '영양성분 초기화',
      reset: () => {
        setNutritionParam('');
        setFilterParams({...filterParams, nutritionParam: ''});
      },
    },
    {
      text: '가격 초기화',
      reset: () => {
        setPriceParam('');
        setFilterParams({...filterParams, priceParam: ''});
      },
    },
    {
      text: '식단구성 초기화',
      reset: () => {
        console.log('식단구성 확인');
      },
    },
  ];

  const FilterHeaderText = () => {
    return (
      <>
        <FilterRow>
          <Button
            onPress={() => {
              setClicked(0);
            }}>
            {params.categoryParam || filterParams.categoryParam ? (
              <Row>
                <Text id="0" clicked={clicked}>
                  카테고리
                </Text>
                <Badge />
              </Row>
            ) : (
              <Text id="0" clicked={clicked}>
                카테고리
              </Text>
            )}
          </Button>
          <Button
            onPress={() => {
              setClicked(1);
            }}>
            {params.nutritionParam || filterParams.nutritionParam ? (
              <Row>
                <Text id="1" clicked={clicked}>
                  영양성분
                </Text>
                <Badge />
              </Row>
            ) : (
              <Text id="1" clicked={clicked}>
                영양성분
              </Text>
            )}
          </Button>
          <Button
            onPress={() => {
              setClicked(2);
            }}>
            {params.priceParam || filterParams.priceParam ? (
              <Row>
                <Text id="2" clicked={clicked}>
                  가격
                </Text>
                <Badge />
              </Row>
            ) : (
              <Text id="2" clicked={clicked}>
                가격
              </Text>
            )}
          </Button>
          <Button
            onPress={() => {
              setClicked(3);
            }}>
            <Row>
              <Text id="3" clicked={clicked}>
                식단구성
              </Text>
            </Row>
          </Button>
          <Button>
            <Image style={{marginTop: 5}} source={icons.initialize_24} />
          </Button>
        </FilterRow>
      </>
    );
  };
  const ShowContent = (i: any) => {
    return i.index === 0 ? (
      <CategoryContent
        setCategoryParam={setCategoryParam}
        categoryParam={categoryParam}
      />
    ) : i.index === 1 ? (
      <NutritionContent
        setNutritionParam={setNutritionParam}
        nutritionParam={nutritionParam}
        filterParams={filterParams}
      />
    ) : i.index === 2 ? (
      <PriceContent
        setPriceParam={setPriceParam}
        priceParam={priceParam}
        filterParams={filterParams}
      />
    ) : i.index === 3 ? (
      <AutoDietContent />
    ) : null;
  };

  return (
    <>
      <ScrollView>
        <FilterHeaderText />

        <ShowContent index={clicked} />
        <BottomRow>
          <BtnCTA
            style={{
              flex: 1,
            }}
            btnStyle={'border'}
            onPress={resetType[clicked].reset}>
            <BottomText style={{color: colors.textSub}}>
              {resetType[clicked].text}
            </BottomText>
          </BtnCTA>
          <BtnCTA
            style={{
              flex: 1,
              marginLeft: 8,
            }}
            btnStyle={'activated'}
            onPress={() => {
              setFilterParams(params);
              closeModal(false);
            }}>
            <BottomText>확인</BottomText>
          </BtnCTA>
        </BottomRow>
      </ScrollView>
    </>
  );
};

export default FilterModalContent;

const Text = styled.Text`
  font-size: 18px;
  margin-right: 26px;
  color: ${({id, clicked}) =>
    id === String(clicked) ? colors.textMain : colors.textSub};
  font-weight: ${({id, clicked}) =>
    id === String(clicked) ? 'bold' : 'normal'};
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
  margin-top: 24px;
`;
const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const SliderTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
`;
const Badge = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 8px;
  background-color: ${colors.main};
  position: absolute;
  top: 0px;
  right: 20px;
`;
const MODAL_WIDTH = 328;
const MODAL_INNER_WIDTH = MODAL_WIDTH - 32;
const SLIDER_WIDTH = MODAL_INNER_WIDTH - 32;
