import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import * as Progress from 'react-native-progress';

import colors from '../../../styles/colors';
import {VerticalSpace} from '../../../styles/StyledConsts';
import {
  checkNutrSatisfied,
  getExceedIdx,
  sumUpNutrients,
} from '../../../util/sumUp';

import {useGetBaseLine} from '../../../query/queries/baseLine';
import {useListDietDetail} from '../../../query/queries/diet';
import DTooltip from '../DTooltip';
import {NUTR_ERROR_RANGE, SCREENWIDTH} from '../../../constants/constants';
import {RootState} from '../../../stores/store';
import {useDispatch, useSelector} from 'react-redux';
import {setNutrTooltipText} from '../../../stores/slices/cartSlice';

const indicatorColorsByTitle: {[key: string]: string} = {
  '칼로리(kcal)': colors.main,
  '탄수화물(g)': colors.blue,
  '단백질(g)': colors.green,
  '지방(g)': colors.orange,
};

const nutrUpperBoundByTitle: {[key: string]: number} = {
  '칼로리(kcal)': NUTR_ERROR_RANGE['calorie'][1],
  '탄수화물(g)': NUTR_ERROR_RANGE['carb'][1],
  '단백질(g)': NUTR_ERROR_RANGE['protein'][1],
  '지방(g)': NUTR_ERROR_RANGE['fat'][1],
};

/** props:
 * 1. title '칼로리(g)' | '탄수화물(g)' | '단백질(g)' | '지방(g)'
 * 2. numerator(분자)
 * 3. denominator(분모) */
interface INutrientProgress {
  title: string;
  numerator: number;
  denominator: number;
}
const ProgressBar = ({title, numerator, denominator}: INutrientProgress) => {
  const indicatorColor =
    numerator > denominator + nutrUpperBoundByTitle[title]
      ? colors.warning
      : indicatorColorsByTitle[title];
  return (
    <ProgressBarContainer>
      <ProgressBarTitle>{title}</ProgressBarTitle>
      <Progress.Bar
        style={{marginTop: 5}}
        progress={numerator / denominator}
        width={null}
        height={4}
        color={indicatorColor}
        unfilledColor={colors.bgBox}
        borderWidth={0}
      />
      <ProgressBarNumber>{`${numerator}/${denominator}`}</ProgressBarNumber>
    </ProgressBarContainer>
  );
};

const NutrientsProgress = ({currentDietNo}: {currentDietNo: string}) => {
  // redux
  const {nutrTooltipText} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  // react-query
  const {data: baseLineData, isInitialLoading} = useGetBaseLine();
  const {data: dietDetailData} = useListDietDetail(currentDietNo);

  // etc
  const {cal, carb, protein, fat} = sumUpNutrients(dietDetailData);

  // tooltip 위치 계산
  const isSatisfied = checkNutrSatisfied(baseLineData, cal, carb, protein, fat);
  const exceedIdx = getExceedIdx(baseLineData, cal, carb, protein, fat);
  const tootipPosition = isSatisfied
    ? 0
    : -8 + ((SCREENWIDTH - 16) / 4) * exceedIdx;

  useEffect(() => {
    const tooltipText =
      exceedIdx !== -1
        ? '영양이 초과되었어요'
        : isSatisfied
        ? '영양 목표에 부합하는 끼니가 완성되었어요\n새로운 끼니를 추가하거나 장바구니로 이동해보세요!'
        : '';
    dispatch(setNutrTooltipText(tooltipText));
  }, [baseLineData, dietDetailData]);

  return (
    <Container>
      <DTooltip
        text={nutrTooltipText}
        tooltipShow={nutrTooltipText !== ''}
        showCheck={true}
        reversed={true}
        boxTop={58}
        boxLeft={exceedIdx < 3 ? tootipPosition : undefined}
        boxRight={exceedIdx === 3 ? -8 : undefined}
        triangleRight={
          exceedIdx === 3 ? (SCREENWIDTH - 16) / 4 - 16 : undefined
        }
        onPressFn={() => dispatch(setNutrTooltipText(''))}
      />
      {isInitialLoading ? (
        <ActivityIndicator />
      ) : (
        baseLineData && (
          <>
            <ProgressBar
              title="칼로리(kcal)"
              numerator={cal}
              denominator={parseInt(baseLineData.calorie)}
            />
            <VerticalSpace width={8} />

            <ProgressBar
              title="탄수화물(g)"
              numerator={carb}
              denominator={parseInt(baseLineData.carb)}
            />
            <VerticalSpace width={8} />

            <ProgressBar
              title="단백질(g)"
              numerator={protein}
              denominator={parseInt(baseLineData.protein)}
            />
            <VerticalSpace width={8} />

            <ProgressBar
              title="지방(g)"
              numerator={fat}
              denominator={parseInt(baseLineData.fat)}
            />
          </>
        )
      )}
    </Container>
  );
};

export default NutrientsProgress;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 70px;
  justify-content: center;
`;

const ProgressBarTitle = styled.Text`
  font-size: 12px;
  color: ${colors.textMain};
  text-align: left;
`;
const ProgressBarNumber = styled.Text`
  font-size: 12px;
  margin-top: 5px;
  color: ${colors.textMain};
  text-align: right;
`;

const Container = styled.View`
  background-color: ${colors.white};
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
