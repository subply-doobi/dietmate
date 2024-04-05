import {TouchableOpacityProps} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import {TextMain} from './styledComps';
import colors from '../colors';
import DropShadow from 'react-native-drop-shadow';
import ShadowView from './ShadowView';

interface ICtaButton extends TouchableOpacityProps {
  btnStyle?: 'active' | 'inactive' | 'border' | 'borderActivated' | 'kakao';
  btnColor?: string;
  btnText?: string;
  bottomFloat?: boolean;
}
const CtaButton = ({
  btnStyle,
  btnColor,
  btnText,
  bottomFloat = false,
  ...props
}: ICtaButton) => {
  return (
    <ShadowView>
      <BtnCTA
        btnStyle={btnStyle}
        disabled={btnStyle === 'inactive' ? true : false}
        bottomFloat={bottomFloat}
        {...props}>
        <BtnText btnStyle={btnStyle}>{btnText}</BtnText>
      </BtnCTA>
    </ShadowView>
  );
};

export default CtaButton;

interface IBtnCTA {
  btnStyle?: 'active' | 'inactive' | 'border' | 'kakao' | 'borderActivated';
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
            : `${colors.main}`};
  align-items: center;
  align-self: center;
  justify-content: center;
  border-width: ${({btnStyle}) =>
    btnStyle === 'border' || btnStyle === 'borderActivated' ? '1px' : '0px'};
  border-color: ${({btnStyle}) =>
    btnStyle === 'border'
      ? colors.inactivated
      : btnStyle === 'borderActivated'
        ? colors.main
        : colors.white};
`;

interface IBtnText {
  btnStyle?: 'active' | 'inactive' | 'border' | 'kakao' | 'borderActivated';
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
