import React, {useState, useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import {
  Row,
  HorizontalLine,
  BtnCTA,
  BtnBottomCTA,
  TextMain,
} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import {useWeightPurposeCode, useFilterCode} from '../../query/queries/code';
import {useListProduct} from '../../query/queries/product';
import {useListCategory, useCountCategory} from '../../query/queries/category';
import {ProgressBarAndroidComponent, ScrollView} from 'react-native';
import DSlider from '../common/slider/DSlider';
import CategoryContent from './filterContents/CategoryContent';
import NutritionContent from './filterContents/NutritionContent';
import PriceContent from './filterContents/PriceContent';

const FilterModalContent = props => {
  const {filterIndex} = props;
  const {setFilterCategoryParam} = props;
  const [clicked, setClicked] = useState(filterIndex);
  const [categoryParam, setCategoryParam] = useState('');
  const [nutritionParam, setNutritionParam] = useState('');
  const [priceParam, setPriceParam] = useState('');
  console.log('filterModalContent:', categoryParam);
  const resetType = [
    {
      text: '카테고리 초기화',
      reset: () => {
        console.log('카테고리 reset');
      },
      onPress: () => {
        console.log('카테고리 확인');
      },
    },
    {
      text: '영양성분 초기화',
      onPress: () => {
        console.log('영양성분 확인');
      },
    },
    {
      text: '가격 초기화',
      onPress: () => {
        console.log('가격 확인');
      },
    },
    {
      text: '식단구성 초기화',
      onPress: () => {
        console.log('식단구성 확인');
      },
    },
  ];
  const AutoDietContent = () => {
    return <Text>auto</Text>;
  };
  const FilterHeaderText = () => {
    return (
      <>
        <FilterRow>
          <Button
            onPress={() => {
              setClicked(0);
            }}>
            <Text id="0" clicked={clicked}>
              카테고리
            </Text>
          </Button>
          <Button
            onPress={() => {
              setClicked(1);
            }}>
            <Text id="1" clicked={clicked}>
              영양성분
            </Text>
          </Button>
          <Button
            onPress={() => {
              setClicked(2);
            }}>
            <Text id="2" clicked={clicked}>
              가격
            </Text>
          </Button>
          <Button
            onPress={() => {
              setClicked(3);
            }}>
            <Text id="3" clicked={clicked}>
              식단구성
            </Text>
          </Button>
          <Button>
            <Image
              style={{marginTop: 5}}
              source={require('../../assets/icons/24_filterInitialize.png')}
            />
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
      <NutritionContent setNutritionParam={setNutritionParam} />
    ) : i.index === 2 ? (
      <PriceContent />
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
            style={{marginRight: 8, marginTop: 5}}
            btnStyle={'border'}
            width="180"
            onPress={() => console.log('초기화')}>
            <BottomText style={{color: colors.textSub}}>
              {resetType[clicked].text}
            </BottomText>
          </BtnCTA>
          <BtnCTA
            style={{marginTop: 5}}
            btnStyle={'activated'}
            width="180"
            onPress={resetType[clicked].onPress}>
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
