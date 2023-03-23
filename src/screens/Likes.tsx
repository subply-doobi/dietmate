import React, {useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../stores/store';
import {
  Container,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../styles/styledConsts';

import MenuSelect from '../components/common/MenuSelect';
import MenuHeader from '../components/common/MenuHeader';
import NutrientsProgress from '../components/common/NutrientsProgress';
import LikeFoodList from '../components/likes/LikeFoodList';

const Likes = () => {
  // redux
  const {menuIndex} = useSelector((state: RootState) => state.cart);
  const {likeFoods} = useSelector((state: RootState) => state.like);
  const dispatch = useDispatch();
  // test data
  const [menuSelectOpen, setMenuSelectOpen] = useState(false);

  return (
    <Container>
      <MenuSelectContainer>
        <MenuHeader
          menuSelectOpen={menuSelectOpen}
          setMenuSelectOpen={setMenuSelectOpen}
        />
      </MenuSelectContainer>
      <NutrientsProgress menuIndex={menuIndex} />
      <Row style={{marginTop: 32}}>
        <ListTitle>찜한 상품</ListTitle>
        <NoOfFoods>{likeFoods?.length}</NoOfFoods>
      </Row>
      <HorizontalLine style={{marginTop: 8}} />
      <FlatList
        style={{marginTop: 24}}
        data={likeFoods}
        renderItem={item => <LikeFoodList item={item} menuIndex={menuIndex} />}
        ItemSeparatorComponent={() => <HorizontalSpace height={16} />}
        keyExtractor={item => item.productNo}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}
      />
      {menuSelectOpen && <MenuSelect setOpen={setMenuSelectOpen} />}
    </Container>
  );
};

export default Likes;

const MenuSelectContainer = styled.View`
  width: 100%;
  height: 48px;
  justify-content: center;
`;

const ListTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const NoOfFoods = styled(TextSub)`
  font-size: 16px;
`;
