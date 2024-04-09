import React, {useEffect} from 'react';
import styled from 'styled-components/native';

import {Row, TextMain} from '../../../shared/ui/styledComps';
import colors from '../../../shared/colors';
import {RootState} from '../../../app/store/reduxStore';
import {useListDietDetail} from '../../../shared/api/queries/diet';
import {useDispatch, useSelector} from 'react-redux';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';
import {icons} from '../../../shared/iconSource';
import {
  FILTER_LIST,
  NUTR_ERROR_RANGE,
  categoryCodeToName,
} from '../../../shared/constants';
import {
  changeSelectedFilter,
  copySortFilter,
  initializeSortFilter,
  setFilterByRemainNutr,
} from '../../../features/reduxSlices/sortFilterSlice';
import {checkisFiltered} from '../../home/util/filterUtils';

interface IFilter {
  setFilterModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchBarFocus: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter = ({setFilterModalShow, setSearchBarFocus}: IFilter) => {
  // redux
  const dispatch = useDispatch();
  const {currentDietNo} = useSelector((state: RootState) => state.common);
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
                // filter bottom sheet 열 때 적용되어있는 sort, filter 복사
                dispatch(copySortFilter());
                dispatch(changeSelectedFilter(i));
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
          setSearchBarFocus(false);
        }}>
        <InitializeImg source={icons.initialize_24} />
      </InitializeBtn>
    </Row>
  );
};
export default Filter;

const FilterBtn = styled.TouchableOpacity<{isActivated: boolean}>`
  height: 32px;
  padding: 6px 8px 6px 8px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({isActivated}) =>
    isActivated ? colors.dark : colors.inactivated};
  background-color: ${colors.white};
`;

const RemainNutrFilterBtn = styled.TouchableOpacity`
  height: 32px;
  padding: 6px 8px 6px 8px;
  border-radius: 5px;
  background-color: ${colors.dark};
`;

const FilterBtnText = styled(TextMain)<{isActivated: boolean}>`
  font-size: 14px;
  color: ${({isActivated}) => (isActivated ? colors.textMain : colors.textSub)};
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
