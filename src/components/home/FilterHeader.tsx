import React from 'react';
import styled from 'styled-components/native';

import {Row, TextMain} from '../../styles/styledConsts';
import colors from '../../styles/colors';

const FilterHeader = props => {
  const {onPress, setFilterIndex, filterParams} = props;
  return (
    <>
      <Row>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(0);
          }}>
          {filterParams.categoryParam ? (
            <>
              <FilterBtnText>카테고리</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>카테고리</FilterBtnText>
          )}
        </FilterBtn>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(1);
          }}>
          {filterParams.nutritionParam ? (
            <>
              <FilterBtnText>영양성분</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>영양성분</FilterBtnText>
          )}
        </FilterBtn>
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
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(3);
          }}>
          <FilterBtnText>식단구성</FilterBtnText>
        </FilterBtn>
      </Row>
    </>
  );
};
export default FilterHeader;

const FilterBtn = styled.TouchableOpacity`
  height: 20px;
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
