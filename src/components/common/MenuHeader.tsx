import React, {SetStateAction} from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import {TextMain} from '../../styles/styledConsts';
import {findDietSeq} from '../../util/findDietSeq';

import {useListDiet} from '../../query/queries/diet';

interface IMenuHeader {
  menuSelectOpen: boolean;
  setMenuSelectOpen: React.Dispatch<SetStateAction<boolean>>;
}
const MenuHeader = ({menuSelectOpen, setMenuSelectOpen}: IMenuHeader) => {
  // react-query
  const {data: dietData, isLoading: dietDataIsLoading} = useListDiet();
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  return dietDataIsLoading ? (
    <ActivityIndicator />
  ) : (
    <Header onPress={() => setMenuSelectOpen(v => !v)}>
      <HeaderText>{findDietSeq(dietData, currentDietNo).dietSeq}</HeaderText>
      {menuSelectOpen ? (
        <Arrow source={icons.triangleUp_24} />
      ) : (
        <Arrow source={icons.triangleDown_24} />
      )}
    </Header>
  );
};

export default MenuHeader;

const Header = styled.TouchableOpacity`
  flex-direction: row;
`;

const HeaderText = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const Arrow = styled.Image`
  width: 24px;
  height: 24px;
`;
