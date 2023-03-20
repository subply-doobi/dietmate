import {ActivityIndicator} from 'react-native';
import React, {SetStateAction} from 'react';
import styled from 'styled-components/native';
import {TextMain} from '../../styles/styledConsts';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {useListDiet} from '../../query/queries/diet';
import {findDietSeq} from '../../util/findDietSeq';
import {icons} from '../../assets/icons/iconSource';

interface IMenuHeader {
  menuSelectOpen: boolean;
  setMenuSelectOpen: React.Dispatch<SetStateAction<boolean>>;
}
const MenuHeader = ({menuSelectOpen, setMenuSelectOpen}: IMenuHeader) => {
  // react-query
  const {
    data: dietData,
    isLoading: dietDataIsLoading,
    isFetching: dietDataIsFetching,
  } = useListDiet();
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  return dietDataIsLoading ? (
    <ActivityIndicator />
  ) : (
    <Header onPress={() => setMenuSelectOpen(v => !v)}>
      <HeaderText>{findDietSeq(dietData, currentDietNo)}</HeaderText>
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
