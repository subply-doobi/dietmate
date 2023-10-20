import React, {SetStateAction, useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';

//doobi util, redux, etc
import {icons} from '../../assets/icons/iconSource';
import {Row, BtnCTA, Col} from '../../styles/StyledConsts';
import colors from '../../styles/colors';

//doobi Component
import CategoryContent from './filterContents/CategoryContent';
import NutritionContent from './filterContents/NutritionContent';
import PriceContent from './filterContents/PriceContent';
import SearchContent from './filterContents/SearchContent';
import DAlert from '../common/alert/DAlert';
import CommonAlertContent from '../common/alert/CommonAlertContent';
import {IFilterParams} from '../../query/types/product';

interface Props {
  filterIndex: number;
  closeModal: () => void;
  setFilterParams: React.Dispatch<SetStateAction<IFilterParams>>;
  filterParams: any;
}

const FilterModalContent = (props: Props) => {
  const {filterIndex, closeModal, setFilterParams, filterParams} = props;
  const [clicked, setClicked] = useState(filterIndex);
  const [categoryParam, setCategoryParam] = useState(
    filterParams.categoryParam,
  );

  // filter 기본값
  const filterModalInitialState = {
    calorieParam: filterParams.nutritionParam?.calorieParam || [],
    carbParam: filterParams.nutritionParam?.carbParam || [],
    proteinParam: filterParams.nutritionParam?.proteinParam || [],
    fatParam: filterParams.nutritionParam?.fatParam || [],
  };
  // filter 설정되어있을 경우 기본값 설정
  if (filterParams.nutritionParam) {
    filterModalInitialState.calorieParam =
      filterParams.nutritionParam.calorieParam;
    filterModalInitialState.carbParam = filterParams.nutritionParam.carbParam;
    filterModalInitialState.proteinParam =
      filterParams.nutritionParam.proteinParam;
    filterModalInitialState.fatParam = filterParams.nutritionParam.fatParam;
  }

  const [nutritionParam, setNutritionParam] = useState<{
    calorieParam: number[];
    carbParam: number[];
    proteinParam: number[];
    fatParam: number[];
  }>(filterModalInitialState);
  const [priceParam, setPriceParam] = useState<number[]>(
    filterParams.priceParam,
  );
  const params = {
    categoryParam,
    nutritionParam,
    priceParam,
  };
  console.log('FILTERMODALCONTENT/params:', params);
  const [initializeModalShow, setInitializeModalShow] = useState(false);
  const resetType = [
    {
      text: '카테고리 초기화',
      reset: () => {
        setCategoryParam('');
        // setFilterParams({...filterParams, categoryParam: ''});
      },
    },
    {
      text: '영양성분 초기화',
      reset: () => {
        setNutritionParam({
          calorieParam: [],
          carbParam: [],
          proteinParam: [],
          fatParam: [],
        });
        // setFilterParams({...filterParams, nutritionParam: ''});
      },
    },
    {
      text: '가격 초기화',
      reset: () => {
        setPriceParam([]);
        // setFilterParams({...filterParams, priceParam: ''});
      },
    },
  ];
  //filter button 눌렀을때 모달 header text
  const FilterHeaderText = () => {
    return (
      <SafeAreaView>
        <FilterRow>
          <Button
            onPress={() => {
              setClicked(0);
            }}>
            {params.categoryParam ? (
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
            {params.nutritionParam.calorieParam.length === 2 ||
            params.nutritionParam.carbParam.length === 2 ||
            params.nutritionParam.proteinParam.length === 2 ||
            params.nutritionParam.fatParam.length === 2 ? (
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
            {params.priceParam.length === 2 ? (
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
            }}></Button>
          <InitialzieBtn
            onPress={() => resetType.forEach(item => item.reset())}>
            <Image source={icons.initialize_24} />
          </InitialzieBtn>
        </FilterRow>
      </SafeAreaView>
    );
  };
  const showContent = (index: number) => {
    return index === 0 ? (
      <CategoryContent
        setCategoryParam={setCategoryParam}
        categoryParam={categoryParam}
      />
    ) : index === 1 ? (
      // <NutritionContent
      //   setNutritionParam={setNutritionParam}
      //   nutritionParam={nutritionParam}
      //   filterParams={filterParams}
      // />
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
      <SearchContent />
    ) : (
      <></>
    );
  };

  return (
    <Col style={{height: '100%'}}>
      <FilterHeaderText />
      <ScrollView
        style={{marginTop: 16}}
        contentContainerStyle={{paddingBottom: 80}}
        showsVerticalScrollIndicator={false}>
        {/* <ShowContent index={clicked} /> */}
        {/* 이유를 알려줘 */}
        {showContent(clicked)}
      </ScrollView>

      {/* 초기화 | 확인 버튼 */}
      <BottomRow>
        <BtnCTA
          style={{
            flex: 1,
          }}
          btnStyle={'border'}
          onPress={() => {
            resetType[clicked].reset();
          }}>
          <BottomText style={{color: colors.textSub}}>
            {resetType[clicked].text}
          </BottomText>
        </BtnCTA>
        {/* <DAlert
          alertShow={initializeModalShow}
          onConfirm={() => {
            if (isTotalInitailize) {
              setCategoryParam('');
              // setFilterParams('');
              setNutritionParam({
                calorieParam: [],
                carbParam: [],
                proteinParam: [],
                fatParam: [],
              });
              setPriceParam('');
              setInitializeModalShow(false);
            } else {
              resetType[clicked].reset();
              setInitializeModalShow(false);
            }
          }}
          onCancel={() => setInitializeModalShow(false)}
          renderContent={() => (
            <CommonAlertContent text={`적용된 필터가\n초기화 됩니다`} />
          )}
          confirmLabel="초기화"
        /> */}
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

const InitialzieBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
`;

const Image = styled.Image`
  width: 24px;
  height: 24px;
`;
const FilterRow = styled(Row)`
  justify-content: center;
  margin-top: 24px;
  column-gap: 20px;
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
  right: -6px;
`;
