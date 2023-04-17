//RN, 3rd
import {useState} from 'react';
import styled from 'styled-components/native';
// doobi util, redux, etc
import {Row, TextMain} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import {RootState} from '../../stores/store';
import {useListDietDetail} from '../../query/queries/diet';
import {useSelector} from 'react-redux';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {IProductsData} from '../../query/types/product';
import {filterAvailableFoods} from '../../util/home/filterAvailableFoods';
// doobi Component
import DAlert from '../common/alert/DAlert';
import CommonAlertContent from '../common/alert/CommonAlertContent';
// types
import {FILTER_TYPE} from '../home/types/filterType';

interface IFilterHeader {
  onPress: () => void;
  setFilterIndex: React.Dispatch<React.SetStateAction<number>>;
  filterParams: {
    categoryParam?: string;
    nutritionParam?: {
      calorieParam: [number, number];
      carbParam: [number, number];
      proteinParam: [number, number];
      fatParam: [number, number];
    };
    priceParam?: [number, number];
    filterHeaderText?: string;
  };
  filterHeaderText?: string;
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
      <Row>
        {/* 카테고리 버튼*/}
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(0);
          }}>
          {filterParams.categoryParam ? (
            <>
              <FilterBtnText>{filterHeaderText}</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>카테고리</FilterBtnText>
          )}
        </FilterBtn>
        {/* 영양성분 버튼 */}
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(1);
          }}>
          {filterParams.nutritionParam?.calorieParam ||
          filterParams.nutritionParam?.carbParam ||
          filterParams.nutritionParam?.proteinParam ||
          filterParams.nutritionParam?.fatParam ? (
            <>
              <FilterBtnText>영양성분</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>영양성분</FilterBtnText>
          )}
        </FilterBtn>
        {/* 가격 버튼 */}
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(2);
          }}>
          {filterParams.priceParam ? (
            <>
              <FilterBtnText>가격</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>가격</FilterBtnText>
          )}
        </FilterBtn>
        {/* 영양맞춤 버튼 */}
        <FilterBtn onPress={onPressRemainNutrProduct}>
          <FilterBtnText>영양맞춤</FilterBtnText>
        </FilterBtn>
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
  margin-right: 36px;
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
