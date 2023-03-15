import React, {useState} from 'react';
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
  const [clicked, setClicked] = useState(0);
  const {filterIndex} = props;
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
            <Text>카테고리</Text>
          </Button>
          <Button
            onPress={() => {
              setClicked(1);
            }}>
            <Text>영양성분</Text>
          </Button>
          <Button
            onPress={() => {
              setClicked(2);
            }}>
            <Text>가격</Text>
          </Button>
          <Button
            onPress={() => {
              setClicked(3);
            }}>
            <Text>식단구성</Text>
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
    console.log('showcontent:', i.index);
    return i.index === 0 ? (
      <CategoryContent />
    ) : i.index === 1 ? (
      <NutritionContent />
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
        <ShowContent index={clicked ? clicked : filterIndex} />
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
            onPress={() => {
              resetType[clicked].onPress();
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
  margin-right: 16px;
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
