import {TouchableOpacityProps} from 'react-native';
import React, {ReactNode} from 'react';
import styled from 'styled-components/native';
import {Row, TextMain} from './styledComps';
import colors from '../colors';
import DropShadow from 'react-native-drop-shadow';
import ShadowView from './ShadowView';

interface ICtaButton extends TouchableOpacityProps {
  shadow?: boolean;
  btnStyle: 'active' | 'inactive' | 'border' | 'borderActive' | 'kakao';
  btnText?: string;
  btnContent?: () => ReactNode;
  bottomFloat?: boolean;
}
const CtaButton = ({
  shadow = true,
  btnStyle,
  btnText,
  btnContent,
  bottomFloat = false,
  ...props
}: ICtaButton) => {
  return shadow ? (
    <ShadowView>
      <BtnCTA
        btnStyle={btnStyle}
        disabled={btnStyle === 'inactive' ? true : false}
        bottomFloat={bottomFloat}
        {...props}>
        <Row>
          {btnContent && btnContent()}
          <BtnText btnStyle={btnStyle}>{btnText}</BtnText>
        </Row>
      </BtnCTA>
    </ShadowView>
  ) : (
    <BtnCTA
      btnStyle={btnStyle}
      disabled={btnStyle === 'inactive' ? true : false}
      bottomFloat={bottomFloat}
      {...props}>
      <Row>
        {btnContent && btnContent()}
        <BtnText btnStyle={btnStyle}>{btnText}</BtnText>
      </Row>
    </BtnCTA>
  );
};

export default CtaButton;

interface IBtnCTA {
  btnStyle?: 'active' | 'inactive' | 'border' | 'kakao' | 'borderActive';
  bottomFloat?: boolean;
}
export const BtnCTA = styled.TouchableOpacity<IBtnCTA>`
  height: 52px;
  width: 100%;
  border-radius: 4px;

  background-color: ${({btnStyle}) =>
    btnStyle === 'active'
      ? `${colors.main}`
      : btnStyle === 'inactive'
        ? `${colors.inactivated}`
        : btnStyle === 'border'
          ? `${colors.white}`
          : btnStyle === 'kakao'
            ? `${colors.kakaoColor}`
            : `${colors.white}`};
  align-items: center;
  align-self: center;
  justify-content: center;
  border-width: ${({btnStyle}) =>
    btnStyle === 'border' || btnStyle === 'borderActive' ? '1px' : '0px'};
  border-color: ${({btnStyle}) =>
    btnStyle === 'border'
      ? colors.inactivated
      : btnStyle === 'borderActive'
        ? colors.main
        : colors.white};
`;

interface IBtnText {
  btnStyle?: 'active' | 'inactive' | 'border' | 'kakao' | 'borderActive';
}
const BtnText = styled(TextMain)<IBtnText>`
  font-size: 16px;
  line-height: 20px;
  color: ${({btnStyle}) =>
    btnStyle === 'active' || btnStyle === 'inactive'
      ? `${colors.white}`
      : btnStyle === 'border'
        ? `${colors.textSub}`
        : `${colors.textMain}`};
`;
