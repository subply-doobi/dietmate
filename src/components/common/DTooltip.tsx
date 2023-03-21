import {SetStateAction} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {RootState} from '../../stores/store';
import colors from '../../styles/colors';

interface IDtooltip {
  tooltipShow: boolean;
  text: string;
  boxBottom?: number;
  boxTop?: number;
  boxLeft?: number;
  boxRight?: number;
  triangleLeft?: number;
  triangleRight?: number;
  onPressFn?: Function;
}

/** tooltip 박스는 bottom | top | left | right 값 없을 때 bottom, left 기준.
 * triangleLeft, Right 는 tooltip박스 기준 꼭지점 위치
 */
const DTooltip = ({
  tooltipShow,
  text,
  boxBottom,
  boxTop,
  boxLeft,
  boxRight,
  triangleLeft,
  triangleRight,
  onPressFn,
}: IDtooltip) => {
  const boxVerticalStyle =
    boxBottom !== undefined
      ? {bottom: boxBottom}
      : boxTop !== undefined
      ? {top: boxTop}
      : {bottom: 0};
  const boxHorizontalStyle =
    boxLeft !== undefined
      ? {left: boxLeft}
      : boxRight !== undefined
      ? {right: boxRight}
      : {left: 0};
  const triangleHorizontalStyle =
    triangleLeft !== undefined
      ? {left: triangleLeft - 6}
      : triangleRight !== undefined
      ? {right: triangleRight - 6}
      : {left: 10};

  return tooltipShow ? (
    <Container
      style={{...boxVerticalStyle, ...boxHorizontalStyle}}
      onPress={() => (onPressFn ? onPressFn() : {})}>
      <TooltipBox>
        <TooltipText>{text}</TooltipText>
      </TooltipBox>
      <TooltipTriangle style={{...triangleHorizontalStyle}} />
    </Container>
  ) : (
    <></>
  );
};

export default DTooltip;

const Container = styled.TouchableOpacity`
  position: absolute;
  margin: 0px 0px 6px 0px;
`;

const TooltipBox = styled.View`
  background-color: ${colors.warning};
  padding: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
`;

const TooltipText = styled.Text`
  font-size: 14px;
  color: ${colors.white};
`;

const TooltipTriangle = styled.View`
  position: absolute;
  width: 0;
  height: 0;
  bottom: -6px;
  border-left-width: 6px;
  border-right-width: 6px;
  border-top-width: 9px;
  background-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: ${colors.warning};
`;
