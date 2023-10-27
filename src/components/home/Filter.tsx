import React, {SetStateAction, useState} from 'react';
import styled from 'styled-components/native';

import {Row, StyledProps, TextMain} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {RootState} from '../../stores/store';
import {useListDietDetail} from '../../query/queries/diet';
import {useDispatch, useSelector} from 'react-redux';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {icons} from '../../assets/icons/iconSource';
import {
  FILTER_LIST,
  NUTR_ERROR_RANGE,
  categoryCodeToName,
} from '../../constants/constants';
import {
  changeSelectedFilter,
  copySortFilter,
  initializeFilter,
  initializeSortFilter,
  setFilterByRemainNutr,
} from '../../stores/slices/sortFilterSlice';
import {checkisFiltered} from '../../util/home/filterUtils';

interface IFilter {
  setFilterModalShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter = ({setFilterModalShow}: IFilter) => {
  // redux
  const dispatch = useDispatch();
  const {currentDietNo, totalFoodList} = useSelector(
    (state: RootState) => state.cart,
  );
  const {applied} = useSelector((state: RootState) => state.sortFilter);

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });

  return (
    <Row style={{justifyContent: 'space-between'}}>
      <Row style={{columnGap: 8}}>
        <RemainNutrFilterBtn
          onPress={() =>
            dispatch(setFilterByRemainNutr({baseLineData, dietDetailData}))
          }>
          <FilterBtnText style={{color: 'white'}}>남은영양 이하</FilterBtnText>
        </RemainNutrFilterBtn>
        {FILTER_LIST.map((f, i) => {
          const isFiltered = checkisFiltered(applied.filter, f.id);
          return (
            <FilterBtn
              key={i}
              isActivated={isFiltered}
              onPress={() => {
                dispatch(changeSelectedFilter(i));
                // filter bottom sheet 열 때 적용되어있는 sort, filter 복사
                dispatch(copySortFilter());
                setFilterModalShow(true);
              }}>
              <FilterBtnText isActivated={isFiltered}>
                {isFiltered && f.name === 'category'
                  ? categoryCodeToName[applied.filter.category]
                  : f.label}
              </FilterBtnText>
            </FilterBtn>
          );
        })}
      </Row>
      <InitializeBtn
        onPress={() => {
          dispatch(initializeSortFilter());
        }}>
        <InitializeImg source={icons.initialize_24} />
      </InitializeBtn>
    </Row>
  );
};
export default Filter;

const FilterBtn = styled.TouchableOpacity`
  height: 32px;
  padding: 6px 8px 6px 8px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.dark : colors.inactivated};
  background-color: ${colors.white};
`;

const RemainNutrFilterBtn = styled.TouchableOpacity`
  height: 32px;
  padding: 6px 8px 6px 8px;
  border-radius: 5px;
  background-color: ${colors.dark};
`;

const FilterBtnText = styled(TextMain)`
  font-size: 14px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.textMain : colors.textSub};
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
