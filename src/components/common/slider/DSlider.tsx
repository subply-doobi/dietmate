import styled from 'styled-components/native';
import colors from '../../../styles/colors';
import {StyledProps, TextMain} from '../../../styles/styledConsts';
import {Slider} from '@miblanchard/react-native-slider';
import {SetStateAction} from 'react';

interface IDSlider {
  sliderValue: number[];
  setSliderValue: React.Dispatch<SetStateAction<number[]>>;
  minimumValue: number;
  maximumValue: number;
  step: number;
  sliderWidth?: number;
  kcal: string;
  g: string;
}
/** sliderWidth만 선택사항. props 안넘기면 width: 100% 적용 */
const DSlider = ({
  sliderValue,
  setSliderValue,
  minimumValue,
  maximumValue,
  step,
  sliderWidth,
  kcal,
  g,
}: IDSlider) => {
  const width = sliderWidth ? sliderWidth : '100%';
  return (
    <Container>
      <SliderContainer style={{width}}>
        <Slider
          value={sliderValue}
          onValueChange={value => Array.isArray(value) && setSliderValue(value)}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          minimumTrackTintColor={colors.main}
          maximumTrackTintColor={colors.inactivated}
          trackStyle={{height: 2}}
          renderThumbComponent={() => <Thumb />}
          renderAboveThumbComponent={index => (
            <AboveThumbComponent thumbIdx={index}>
              <ThumbText>
                {sliderValue[index]}
                {kcal ? kcal : g ? g : '원'}
              </ThumbText>
            </AboveThumbComponent>
          )}
        />
      </SliderContainer>
    </Container>
  );
};
export default DSlider;

const THUMB_SIZE = 20;

const Container = styled.View`
  width: 100%;
  align-items: center;
  margin-top: -8px;
  padding-bottom: 16px;
`;

const SliderContainer = styled.View`
  width: 100%;
  margin-top: 24px;
`;

const AboveThumbComponent = styled.View`
  width: 56px;
  height: 20px;
  position: absolute;
  left: -${(56 - THUMB_SIZE) / 2}px;
  top: ${({thumbIdx}: StyledProps) =>
    thumbIdx === 0 ? (THUMB_SIZE / 2) * 3 + 6 : -(THUMB_SIZE / 2 + 6)}px;
  align-items: center;
  justify-content: center;
`;

const ThumbText = styled(TextMain)`
  font-size: 14px;
`;

const Thumb = styled.View`
  width: ${THUMB_SIZE}px;
  height: ${THUMB_SIZE}px;
  background-color: ${colors.white};
  border-width: 2px;
  border-color: ${colors.main};
  border-radius: 10px;
`;
