// RN, 3rd
import {useMemo} from 'react';
import styled from 'styled-components/native';
import * as Progress from 'react-native-progress';

// util, const
import colors from '../../../styles/colors';
import {Col, Row, VerticalSpace} from '../../../styles/styledConsts';
import {
  checkNutrSatisfied,
  getExceedIdx,
  sumUpNutrients,
} from '../../../util/sumUp';

// doobi components
import {NUTR_ERROR_RANGE, SCREENWIDTH} from '../../../constants/constants';
import {useRoute} from '@react-navigation/native';
import {icons} from '../../../assets/icons/iconSource';
import DTooltip from '../tooltip/DTooltip';

// react-query
import {useGetBaseLine} from '../../../query/queries/baseLine';
import {IDietDetailData} from '../../../query/types/diet';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../stores/store';
import {setProgressTooltipShow} from '../../../stores/slices/commonSlice';

const indicatorColorsByTitle2: {[key: string]: string} = {
  '칼로리(kcal)': colors.main,
  '탄수화물(g)': colors.main,
  '단백질(g)': colors.main,
  '지방(g)': colors.main,
};
const indicatorColorsByTitle1: {[key: string]: string} = {
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
      : indicatorColorsByTitle2[title];
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

const NutrientsProgress = ({
  dietDetailData,
}: {
  dietDetailData: IDietDetailData;
}) => {
  // redux
  const dispatch = useDispatch();
  const {progressTooltipShow} = useSelector((state: RootState) => state.common);

  // navigation
  const route = useRoute();

  // react-query
  const {data: baseLineData} = useGetBaseLine();

  // etc
  const {cal, carb, protein, fat} = sumUpNutrients(dietDetailData);

  // useMemo
  // 1. 툴팁 보여줄 것인지, 2. 텍스트, 3. 위치 값 memo
  const {exceedIdx, tooltipPosition, tooltipText} = useMemo(() => {
    const isSatisfied = checkNutrSatisfied(
      baseLineData,
      cal,
      carb,
      protein,
      fat,
    );
    const exceedIdx = getExceedIdx(baseLineData, cal, carb, protein, fat);
    const tooltipPosition = isSatisfied
      ? 0
      : -8 + ((SCREENWIDTH - 16) / 4) * exceedIdx;

    const tooltipText =
      exceedIdx !== -1
        ? '영양이 초과되었어요'
        : isSatisfied
          ? '한 끼니가 완성되었어요'
          : '';

    return {exceedIdx, tooltipPosition, tooltipText};
  }, [baseLineData, dietDetailData, progressTooltipShow]);

  return (
    <Container>
      <DTooltip
        text={tooltipText}
        tooltipShow={progressTooltipShow && tooltipText !== ''}
        showIcon={true}
        renderCustomIcon={
          exceedIdx !== -1 && route.name === 'Home'
            ? () => <Icon source={icons.cartWhiteFilled_36} />
            : undefined
        }
        reversed={true}
        boxTop={58}
        boxLeft={exceedIdx < 3 ? tooltipPosition : undefined}
        boxRight={exceedIdx === 3 ? -8 : undefined}
        triangleRight={
          exceedIdx === 3 ? (SCREENWIDTH - 16) / 4 - 16 : undefined
        }
        onPressFn={() => dispatch(setProgressTooltipShow(false))}
      />

      <Col style={{width: '100%', height: 70}}>
        {baseLineData && Object.keys(baseLineData).length !== 0 && (
          <Row
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ProgressBar
              title="칼로리(kcal)"
              numerator={cal}
              denominator={
                Object.keys(baseLineData).length === 0
                  ? 0
                  : parseInt(baseLineData.calorie)
              }
            />
            <VerticalSpace width={8} />

            <ProgressBar
              title="탄수화물(g)"
              numerator={carb}
              denominator={
                Object.keys(baseLineData).length === 0
                  ? 0
                  : parseInt(baseLineData.carb)
              }
            />
            <VerticalSpace width={8} />

            <ProgressBar
              title="단백질(g)"
              numerator={protein}
              denominator={
                Object.keys(baseLineData).length === 0
                  ? 0
                  : parseInt(baseLineData.protein)
              }
            />
            <VerticalSpace width={8} />

            <ProgressBar
              title="지방(g)"
              numerator={fat}
              denominator={
                Object.keys(baseLineData).length === 0
                  ? 0
                  : parseInt(baseLineData.fat)
              }
            />
          </Row>
        )}
      </Col>
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
  align-items: center;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;
