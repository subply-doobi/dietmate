import {View, Text} from 'react-native';
import React, {SetStateAction} from 'react';
import styled from 'styled-components/native';
import {TextMain} from '../../styles/styledConsts';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {useListDiet} from '../../query/queries/diet';

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

interface IMenuHeader {
  menuSelectOpen: boolean;
  setMenuSelectOpen: React.Dispatch<SetStateAction<boolean>>;
}
const MenuHeader = ({menuSelectOpen, setMenuSelectOpen}: IMenuHeader) => {
  // react-query
  const {data: dietData} = useListDiet();
  // redux
  const {menuIndex} = useSelector((state: RootState) => state.cart);
  return (
    <Header onPress={() => setMenuSelectOpen(v => !v)}>
      <HeaderText>{dietData ? dietData[menuIndex]?.dietSeq : ''}</HeaderText>
      {menuSelectOpen ? (
        <Arrow source={require('../../assets/icons/24_dropdown_up.png')} />
      ) : (
        <Arrow source={require('../../assets/icons/24_dropdown_down.png')} />
      )}
    </Header>
  );
};

export default MenuHeader;
