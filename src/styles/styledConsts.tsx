import styled from 'styled-components/native';

import colors from './colors';
import {SCREENWIDTH} from '../constants/constants';

export interface StyledProps {
  isActivated?: boolean;
  isValid?: boolean;
  btnStyle?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  lineColor?: string;
  thumbIdx?: number;
  filterHeight?: number;
  willExceed?: boolean;
}
export const NotoSansLight = styled.Text`
  font-family: 'NotoSansKRLight';
  color: ${colors.textMain};
  include-font-padding: false;
`;
export const NotoSansRegular = styled.Text`
  font-family: 'NotoSansKR';
  color: ${colors.textMain};
  include-font-padding: false;
`;
export const NotoSansMedium = styled.Text`
  font-family: 'NotoSansKRMedium';
  color: ${colors.textMain};
  include-font-padding: false;
`;
export const NotoSansBold = styled.Text`
  font-family: 'NotoSansKRBold';
  color: ${colors.textMain};
  include-font-padding: false;
`;
export const NotoSansBlack = styled.Text`
  font-family: 'NotoSansKRBlack';
  color: ${colors.textMain};
  include-font-padding: false;
`;
export const NotoSansThin = styled.Text`
  font-family: 'NotoSansKRThin';
  color: ${colors.textMain};
  include-font-padding: false;
`;
export const NotoSansLight_Sub = styled.Text`
  font-family: 'NotoSansKRLight';
  color: ${colors.textSub};
  include-font-padding: false;
`;
export const NotoSansRegular_Sub = styled.Text`
  font-family: 'NotoSansKR';
  color: ${colors.textSub};
  include-font-padding: false;
`;
export const NotoSansMedium_Sub = styled.Text`
  font-family: 'NotoSansKRMedium';
  color: ${colors.textSub};
  include-font-padding: false;
`;
export const NotoSansBold_Sub = styled.Text`
  font-family: 'NotoSansKRBold';
  color: ${colors.textSub};
  include-font-padding: false;
`;
export const NotoSansBlack_Sub = styled.Text`
  font-family: 'NotoSansKRBlack';
  color: ${colors.textSub};
  include-font-padding: false;
`;
export const NotoSansThin_Sub = styled.Text`
  font-family: 'NotoSansKRThin';
  color: ${colors.textSub};
  include-font-padding: false;
`;

export const TextMain = styled.Text`
  color: ${colors.textMain};
`;

export const TextSub = styled.Text`
  color: ${colors.textSub};
  font-weight: 300;
`;

export const Container = styled.View`
  flex: 1;
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
`;

export const AlertContentContainer = styled.View`
  padding: 28px 16px 28px 16px;
`;

export const InputHeaderText = styled.Text`
  font-size: 14px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.white};
`;
export const UserInfoTextInput = styled.TextInput`
  justify-content: center;
  align-items: flex-start;
  font-size: 16px;
  color: ${({isValid}: StyledProps) =>
    isValid ? colors.textMain : colors.warning};

  line-height: 24px;

  border-bottom-width: 1px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
  margin-top: -4px;
  padding-bottom: 6px;
`;

export const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;

export const ErrorText = styled.Text`
  font-size: 16px;
  color: #ffffff;
`;
export const ErrorBox = styled.View`
  position: relative;
  align-self: flex-end;
  z-index: 1;

  width: auto;
  height: 24px;
  background-color: ${colors.warning};
  opacity: 0.9;

  border-radius: 3px;

  margin-top: 4px;
  margin-bottom: -28px;

  padding: 0px 10px 0px 10px;
`;

export const AccordionContentContainer = styled.View`
  /* width: ${`${SCREENWIDTH}px`}; */
  width: 100%;
  height: auto;
  background-color: ${colors.white};
  padding: 0px 16px 32px 16px;
`;

export const InputContainer = styled.View`
  width: 100%;
  height: 58px;
  padding-top: 24px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const Col = styled.View``;

export const Seperator = styled.View`
  height: 16px;
`;

/** props 1. btnStyle -> "activated" | "inactivated" | "border" | "borderActivated" | "kakao"
 *  props 2. height -> height: ${p => p.height ?? 52}px
 *  props 3. width -> width: ${p => p.width ?? `${SCREENWIDTH - 32}`}px;
 */
export const BtnCTA = styled.TouchableOpacity`
  height: ${({height}: StyledProps) => (height ? `${height}px` : '52px')};
  width: ${({width}: StyledProps) => (width ? `${width}px` : '100%')};
  border-radius: 4px;
  background-color: ${({btnStyle}: StyledProps) =>
    btnStyle === 'activated'
      ? `${colors.main}`
      : btnStyle === 'inactivated'
        ? `${colors.inactivated}`
        : btnStyle === 'border'
          ? `${colors.white}`
          : btnStyle === 'kakao'
            ? `${colors.kakaoColor}`
            : `${colors.white}`};
  align-items: center;
  align-self: center;
  justify-content: center;
  border-width: ${({btnStyle}: StyledProps) =>
    btnStyle === 'border' || btnStyle === 'borderActivated' ? '1px' : '0px'};
  border-color: ${({btnStyle}: StyledProps) =>
    btnStyle === 'border'
      ? colors.inactivated
      : btnStyle === 'borderActivated'
        ? colors.main
        : colors.white};
`;

export const BtnBottomCTA = styled(BtnCTA)`
  align-self: center;
  margin-top: -60px;
  margin-bottom: 8px;
  elevation: 8;
`;

export const StickyFooter = styled.View`
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  margin-left: 16px;
  margin-right: 16px;
  align-items: center;
  padding: 0px 8px 0px 8px;
`;

/** props1. isActivated -> boolean */
export const BtnSmall = styled.TouchableOpacity`
  height: 32px;
  width: 74px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.inactivated : colors.white};
  border-width: 1px;
  border-color: ${colors.inactivated};
`;

export const BtnText = styled.Text`
  color: ${colors.white};
  font-size: 16px;
`;

/** props1. isActivated -> boolean */
export const BtnSmallText = styled.Text`
  font-size: 14px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.textMain : colors.textSub};
`;

export const VerticalLine = styled.View`
  height: ${({height}: StyledProps) => (height ? `${height}px` : '100%')};
  width: ${({width}: StyledProps) => (width ? `${width}px` : `1px`)};
  background-color: ${colors.inactivated};
`;
export const HorizontalLine = styled.View`
  height: 1px;
  width: ${({width}: StyledProps) => (width ? `${width}px` : '100%')};
  background-color: ${({lineColor}) =>
    lineColor ? lineColor : colors.lineLight};
`;

/** props1. height  */
export const HorizontalSpace = styled.View`
  width: 100%;
  height: ${({height}: StyledProps) => `${height}px`};
  /* background-color: ${colors.white}; */
`;

/** props1. width */
export const VerticalSpace = styled.View`
  height: 100%;
  width: ${({width}: StyledProps) => `${width}px`};
  background-color: ${colors.white};
`;

export const Dot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: ${({backgroundColor}: StyledProps) => `${backgroundColor}`};
`;
