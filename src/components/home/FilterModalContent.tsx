import {ScrollView} from 'react-native';

import styled from 'styled-components/native';
import {
  BtnCTA,
  BtnText,
  Col,
  HorizontalSpace,
  TextMain,
} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import {icons} from '../../assets/icons/iconSource';
import {FILTER_LIST, SCREENWIDTH} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {
  applySortFilter,
  changeSelectedFilter,
  initializeCategory,
  initializeFilter,
  initializeNutrition,
  initializePrice,
} from '../../stores/slices/sortFilterSlice';
import CategoryFilter from './filter/CategoryFilter';
import NutritionFilter from './filter/NutritionFilter';
import {AnyAction, Dispatch} from '@reduxjs/toolkit';
import PriceFilter from './filter/PriceFilter';
import {checkisFiltered} from '../../util/home/filterUtils';

const initializeSome = (
  dispatch: Dispatch<AnyAction>,
  filterId: number | undefined,
) => {
  if (filterId === 0) dispatch(initializeCategory());
  else if (filterId === 1) dispatch(initializeNutrition());
  else if (filterId === 2) dispatch(initializePrice());
  else return;
};

interface IFilterModalContent {
  setFilterModalShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterModalContent = ({setFilterModalShow}: IFilterModalContent) => {
  // redux
  // 0: 카테고리 | 1: 영양성분 | 2: 가격
  const dispatch = useDispatch();
  const {
    copied: {selectedFilter, filter},
  } = useSelector((state: RootState) => state.sortFilter);

  return (
    <Container>
      {/* 카테고리 | 영양성분 | 가격 |  */}
      <FilterTitleRow>
        {FILTER_LIST.map(f => (
          <FilterTitleBtn
            key={f.id}
            onPress={() => dispatch(changeSelectedFilter(f.id))}>
            <FilterTitle isActivated={selectedFilter === f.id}>
              {f.label}
            </FilterTitle>
            <FilterDot isActivated={checkisFiltered(filter, f.id)} />
          </FilterTitleBtn>
        ))}

        {/* 상단 전체초기화 버튼 */}
        <InitialzieBtn
          onPress={() => {
            dispatch(initializeFilter());
          }}>
          <InitializeIcon source={icons.initialize_24} />
        </InitialzieBtn>
      </FilterTitleRow>

      <HorizontalSpace height={16} />

      {/* 0: 카테고리 | 1: 영양성분 | 2: 가격 */}
      <Col style={{flex: 1, marginBottom: 80}}>
        <ScrollView>
          {selectedFilter === 0 && <CategoryFilter />}
          {selectedFilter === 1 && <NutritionFilter />}
          {selectedFilter === 2 && <PriceFilter />}
        </ScrollView>
      </Col>

      {/* 하단 필터 초기화 및 확인 버튼 */}
      <BottomBtnBox>
        <BtnCTA
          height={52}
          btnStyle="border"
          width={(SCREENWIDTH - 32 - 8) / 2}
          onPress={() => {
            initializeSome(dispatch, selectedFilter);
          }}>
          <BtnText style={{color: colors.textSub}}>
            {selectedFilter !== undefined && FILTER_LIST[selectedFilter].label}{' '}
            초기화
          </BtnText>
        </BtnCTA>
        <BtnCTA
          height={52}
          btnStyle="activated"
          width={(SCREENWIDTH - 32 - 8) / 2}
          onPress={() => {
            dispatch(applySortFilter());
            setFilterModalShow(false);
          }}>
          <BtnText>확인</BtnText>
        </BtnCTA>
      </BottomBtnBox>
    </Container>
  );
};

export default FilterModalContent;

const Container = styled.View`
  height: 100%;
`;

const FilterTitleRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin-top: 24px;

  column-gap: 12px;
`;

const FilterTitleBtn = styled.Pressable`
  flex-direction: row;
`;
const FilterTitle = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
  color: ${({isActivated}: {isActivated: boolean}) =>
    isActivated ? colors.textMain : colors.textSub};
`;
const FilterDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({isActivated}: {isActivated: boolean}) =>
    isActivated ? colors.main : colors.white};
`;

const InitialzieBtn = styled.Pressable`
  position: absolute;
  right: 0px;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
`;

const InitializeIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const BottomBtnBox = styled.View`
  position: absolute;
  bottom: 0px;
  justify-content: center;
  column-gap: 8px;
  flex-direction: row;
`;
