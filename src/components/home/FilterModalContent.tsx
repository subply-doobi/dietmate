import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {icons} from '../../assets/icons/iconSource';
import {Row, BtnCTA, Col} from '../../styles/styledConsts';
import colors from '../../styles/colors';

import CategoryContent from './filterContents/CategoryContent';
import NutritionContent from './filterContents/NutritionContent';
import PriceContent from './filterContents/PriceContent';
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
    {
      text: '전부 초기화',
      reset: () => {
        console.log('전부 확인');
      },
    },
  ];

  const FilterHeaderText = () => {
    return (
      <SafeAreaView>
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
          <Button
            onPress={() => {
              setCategoryParam('');
              setNutritionParam('');
              setPriceParam('');
            }}>
            <Image source={icons.initialize_24} />
          </Button>
        </FilterRow>
      </SafeAreaView>
    );
  };
  const ShowContent = ({index}) => {
    return index === 0 ? (
      <CategoryContent
        setCategoryParam={setCategoryParam}
        categoryParam={categoryParam}
        며
      />
    ) : index === 1 ? (
      <NutritionContent
        setNutritionParam={setNutritionParam}
        nutritionParam={nutritionParam}
        filterParams={filterParams}
      />
    ) : index === 2 ? (
      <PriceContent
        setPriceParam={setPriceParam}
        priceParam={priceParam}
        filterParams={filterParams}
      />
    ) : index === 3 ? (
      <AutoDietContent />
    ) : (
      <></>
    );
  };
  //useEffect에 맞춰서 초기값 설정하게 하고싶음
  //
  return (
    <Col style={{height: '100%'}}>
      <ScrollView contentContainerStyle={{paddingBottom: 64}}>
        <FilterHeaderText />
        <ShowContent index={clicked} />
      </ScrollView>

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
    </Col>
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
  position: absolute;
  bottom: 0px;
  flex-direction: row;
  justify-content: space-between;
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
