import React, {useState} from 'react';
import styled from 'styled-components/native';

import {Row, StyledProps, TextMain} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {RootState} from '../../stores/store';
import {useListDietDetail} from '../../query/queries/diet';
import {useSelector} from 'react-redux';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {IProductsData} from '../../query/types/product';
import {filterAvailableFoods} from '../../util/home/filterUtils';
import DAlert from '../common/alert/DAlert';
import CommonAlertContent from '../common/alert/CommonAlertContent';
import {icons} from '../../assets/icons/iconSource';

interface IFilterHeader {
  onPress: () => void;
  setFilterIndex: React.Dispatch<React.SetStateAction<number>>;
  filterParams: {
    categoryParam: string;
    nutritionParam: {
      calorieParam: number[];
      carbParam: number[];
      fatParam: number[];
      proteinParam: number[];
    };
    priceParam: [number, number];
  };
  filterHeaderText: string;
  setRemainNutrProductData: React.Dispatch<
    React.SetStateAction<IProductsData | undefined>
  >;
}

const FilterHeader = (props: IFilterHeader) => {
  // redux
  const {currentDietNo, totalFoodList} = useSelector(
    (state: RootState) => state.cart,
  );

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });

  // state
  const [remainNutrProductAlertShow, setRemainNutrProductAlertShow] =
    useState(false);

  // etc
  const {
    onPress,
    setFilterIndex,
    filterParams,
    setRemainNutrProductData,
    filterHeaderText,
  } = props;

  const onPressRemainNutrProduct = () => {
    const remainNutrProductData = filterAvailableFoods(
      totalFoodList,
      baseLineData,
      dietDetailData,
    );
    if (remainNutrProductData.length === 0) {
      setRemainNutrProductAlertShow(true);
      return;
    }
    setRemainNutrProductData(remainNutrProductData);
  };

  return (
    <>
      <Row style={{justifyContent: 'space-between'}}>
        <Row style={{columnGap: 8}}>
          <RemainNutrFilterBtn onPress={onPressRemainNutrProduct}>
            <FilterBtnText>남은영양 이하</FilterBtnText>
          </RemainNutrFilterBtn>
          <FilterBtn
            onPress={() => {
              onPress();
              setFilterIndex(0);
            }}
            isActivated={filterParams.categoryParam ? true : false}>
            <FilterBtnText>
              {filterParams.categoryParam ? filterHeaderText : '카테고리'}
            </FilterBtnText>
          </FilterBtn>
          <FilterBtn
            onPress={() => {
              onPress();
              setFilterIndex(1);
            }}
            isActivated={
              filterParams.nutritionParam.calorieParam.length === 2 ||
              filterParams.nutritionParam.carbParam.length === 2 ||
              filterParams.nutritionParam.proteinParam.length === 2 ||
              filterParams.nutritionParam.fatParam.length === 2
                ? true
                : false
            }>
            <FilterBtnText>영양성분</FilterBtnText>
          </FilterBtn>
          <FilterBtn
            onPress={() => {
              onPress();
              setFilterIndex(2);
            }}
            isActivated={filterParams.priceParam.length === 2 ? true : false}>
            <FilterBtnText>가격</FilterBtnText>
          </FilterBtn>
        </Row>
        <InitializeBtn onPress={() => {}}>
          <InitializeImg source={icons.initialize_24} />
        </InitializeBtn>
        <DAlert
          alertShow={remainNutrProductAlertShow}
          onConfirm={() => setRemainNutrProductAlertShow(false)}
          onCancel={() => setRemainNutrProductAlertShow(false)}
          renderContent={() => (
            <CommonAlertContent text="남은 영양에 맞는 상품이 없어요" />
          )}
          NoOfBtn={1}
        />
      </Row>
    </>
  );
};
export default FilterHeader;

const FilterBtn = styled.TouchableOpacity`
  height: 32px;
  /* margin-left: 8px; */
  padding: 6px 8px 6px 8px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${colors.inactivated};
  background-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.backgroundLight : colors.white};
`;

const RemainNutrFilterBtn = styled.TouchableOpacity`
  height: 32px;
  padding: 6px 8px 6px 8px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${colors.highlight};
  background-color: ${colors.white};
`;

const FilterBtnText = styled(TextMain)`
  font-size: 14px;
`;

const Badge = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 8px;
  background-color: ${colors.main};
  position: absolute;
  top: 0px;
  right: -8px;
`;

const InitializeBtn = styled.TouchableOpacity`
  height: 32px;
  width: 24px;
  justify-content: center;
  align-items: center;
`;
const InitializeImg = styled.Image`
  width: 24px;
  height: 24px;
`;
