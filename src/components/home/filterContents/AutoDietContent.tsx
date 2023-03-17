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
        <Row>
          <CheckboxImage
            source={require(`../../../assets/icons/24_checkbox.png`)}
          />
          <ButtonText>식단구성 쉽게하기</ButtonText>
        </Row>
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
const ButtonText = styled.Text`
  font-size: 18px;
  color: ${colors.textMain};
  font-weight: bold;
`;
const Button = styled.TouchableOpacity`
  height: 58px;
  justify-content: center;
`;
const CheckboxImage = styled.Image`
  width: 24px;
  height: 24px;
`;
