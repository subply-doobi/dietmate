import React from 'react';
import styled from 'styled-components/native';
import {useState} from 'react';

import {icons} from '../../../assets/icons/iconSource';
import colors from '../../../styles/colors';
import {Col} from '../../../styles/StyledConsts';

import DTooltip from '../../common/DTooltip';

const SearchContent = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <>
      <MenuAndSearchBox>
        <SearchInput
          onChangeText={setSearchText}
          value={searchText}
          placeholder="검색어 입력"
          // onSubmitEditing={() => refetchProduct()}
        />
        <SearchCancelBtn
          onPress={() => {
            setSearchText('');
          }}>
          <SearchCancelImage source={icons.cancelRound_24} />
        </SearchCancelBtn>
      </MenuAndSearchBox>
    </>
  );
};

export default SearchContent;

const MenuAndSearchBox = styled.View`
  flex-direction: row;
  width: 50%;
  height: 48px;
  align-items: flex-end;
`;

const SearchInput = styled.TextInput`
  height: 32px;
  margin-left: 8px;
  border-radius: 4px;
  background-color: ${colors.bgBox};
  padding: 5px 8px 5px 8px;
  font-size: 14px;
  color: ${colors.textSub};
`;
const SearchCancelBtn = styled.TouchableOpacity`
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
`;
const SearchCancelImage = styled.Image`
  width: 24px;
  height: 24px;
`;
