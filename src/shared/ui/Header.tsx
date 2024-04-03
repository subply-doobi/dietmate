// RN
import React from 'react';

// 3rd
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as Progress from 'react-native-progress';

// doobi
import colors from '../colors';
import {SCREENWIDTH} from '../constants';
import {Icon, TextMain} from './styledComps';
import {icons} from '../iconSource';

interface IHeader {
  headerTitle: string;
  navigation: NativeStackNavigationProp<any>;
  canGoBack: boolean;
  progress: number;
}
const Header = ({headerTitle, navigation, canGoBack, progress}: IHeader) => {
  return (
    <Container>
      <HeaderBar>
        {canGoBack && (
          <BackBtn onPress={() => navigation.goBack()}>
            <Icon source={icons.back_24} style={{marginLeft: 16}} />
          </BackBtn>
        )}
        <HeaderTitle ellipsizeMode="tail" numberOfLines={1}>
          {headerTitle}
        </HeaderTitle>
      </HeaderBar>
    </Container>
  );
};

export default Header;

const Container = styled.SafeAreaView`
  width: 100%;
  height: 52px;
  background-color: ${colors.white};

  justify-content: center;
  align-items: center;
`;

const HeaderBar = styled.View`
  width: 100%;
  height: 48px;
  background-color: ${colors.white};
  justify-content: center;
  align-items: center;
`;

const BackBtn = styled.TouchableOpacity`
  height: 48px;
  width: 48px;
  position: absolute;
  left: 0;
  justify-content: center;
`;

const HeaderTitle = styled(TextMain)`
  width: ${SCREENWIDTH - 96}px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;
