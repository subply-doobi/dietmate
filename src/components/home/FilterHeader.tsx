import React from 'react';
import {Row, TextMain} from '../../styles/styledConsts';
import styled from 'styled-components/native';

const FilterHeader = props => {
  const {onPress, setFilterIndex} = props;
  console.log(props);
  return (
    <>
      <Row>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(0);
          }}>
          <FilterBtnText>카테고리</FilterBtnText>
        </FilterBtn>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(1);
          }}>
          <FilterBtnText>영양성분</FilterBtnText>
        </FilterBtn>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(2);
          }}>
          <FilterBtnText>가격</FilterBtnText>
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
