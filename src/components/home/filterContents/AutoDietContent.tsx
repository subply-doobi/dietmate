import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {
  Row,
  HorizontalLine,
  BtnCTA,
  BtnBottomCTA,
  TextMain,
} from '../../../styles/styledConsts';
import colors from '../../../styles/colors';

const AutoDietContent = () => {
  return (
    <>
      <Container>
        <Text>현재 식단 기준으로 목표섭취량을 초과하지 않는</Text>
        <Text>무작위 5개 식품들만 보여줍니다.</Text>
      </Container>
      <Button>
        <CheckboxImage
          source={require(`../../../assets/icons/24_checkbox.png`)}
        />
        <ButtonText>식단구성 쉽게하기</ButtonText>
      </Button>
    </>
  );
};

export default AutoDietContent;

const Container = styled.View`
  margin-top: 64px;
`;

const Text = styled.Text`
  font-size: 16px;
  color: ${colors.textMain};
`;
const Button = styled.TouchableOpacity`
  margin-top: 118px;
  jutify-content: center;
  flex-direction: row;
`;
const ButtonText = styled.Text`
  font-size: 18px;
  color: ${colors.textMain};
  font-weight: bold;
  margin-left: 8px;
`;
const CheckboxImage = styled.Image`
  width: 24px;
  height: 24px;
`;
