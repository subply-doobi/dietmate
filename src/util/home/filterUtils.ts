import {IFilterParams} from '../../query/types/product';
import {FILTER_BTN_RANGE} from '../../constants/constants';
import {ISortFilter} from '../../stores/slices/sortFilterSlice';

export const checkisFiltered = (
  filter: ISortFilter['filter'],
  filterId: number,
) => {
  // 카테고리
  if (filterId === 0) return filter.category.length > 0;

  // 가격
  if (filterId === 2) return filter.price.length > 0;

  // 영양성분
  return Object.values(filter.nutrition).some(value => value.length > 0);
};

const findIdxRange = (
  calorieInitialState: number[],
  carbInitialState: number[],
  proteinInitialState: number[],
  fatInitialState: number[],
) => {
  const calorieIdxRange =
    calorieInitialState.length === 0
      ? []
      : [
          FILTER_BTN_RANGE[0].value.findIndex(
            item =>
              item[0] <= calorieInitialState[0] &&
              calorieInitialState[0] < item[1],
          ),
          calorieInitialState[1] >
          FILTER_BTN_RANGE[0].value[FILTER_BTN_RANGE[0].value.length - 1][1]
            ? FILTER_BTN_RANGE[0].value.length - 1
            : FILTER_BTN_RANGE[0].value.findIndex(
                item =>
                  item[0] <= calorieInitialState[1] &&
                  calorieInitialState[1] < item[1],
              ),
        ];
  const carbIdxRange =
    carbInitialState.length === 0
      ? []
      : [
          FILTER_BTN_RANGE[1].value.findIndex(
            item =>
              item[0] <= carbInitialState[0] && carbInitialState[0] < item[1],
          ),
          carbInitialState[1] >
          FILTER_BTN_RANGE[1].value[FILTER_BTN_RANGE[1].value.length - 1][1]
            ? FILTER_BTN_RANGE[1].value.length - 1
            : FILTER_BTN_RANGE[1].value.findIndex(
                item =>
                  item[0] <= carbInitialState[1] &&
                  carbInitialState[1] < item[1],
              ),
        ];
  const proteinIdxRange =
    proteinInitialState.length === 0
      ? []
      : [
          FILTER_BTN_RANGE[2].value.findIndex(
            item =>
              item[0] <= proteinInitialState[0] &&
              proteinInitialState[0] < item[1],
          ),
          proteinInitialState[1] >
          FILTER_BTN_RANGE[2].value[FILTER_BTN_RANGE[2].value.length - 1][1]
            ? FILTER_BTN_RANGE[2].value.length - 1
            : FILTER_BTN_RANGE[2].value.findIndex(
                item =>
                  item[0] <= proteinInitialState[1] &&
                  proteinInitialState[1] < item[1],
              ),
        ];
  const fatIdxRange =
    fatInitialState.length === 0
      ? []
      : [
          FILTER_BTN_RANGE[3].value.findIndex(
            item =>
              item[0] <= fatInitialState[0] && fatInitialState[0] < item[1],
          ),
          fatInitialState[1] >
          FILTER_BTN_RANGE[3].value[FILTER_BTN_RANGE[3].value.length - 1][1]
            ? FILTER_BTN_RANGE[3].value.length - 1
            : FILTER_BTN_RANGE[3].value.findIndex(
                item =>
                  item[0] <= fatInitialState[1] && fatInitialState[1] < item[1],
              ),
        ];

  console.log(calorieIdxRange, carbIdxRange, proteinIdxRange, fatIdxRange);

  return {
    calorie: calorieIdxRange,
    carb: carbIdxRange,
    protein: proteinIdxRange,
    fat: fatIdxRange,
  };
};

// TBD | filter type 지정
export const setInitialIdx = (
  filterParams: IFilterParams,
  setNutrIdxRange: any,
) => {
  const calorieInitialState = filterParams.nutritionParam?.calorieParam;
  const carbInitialState = filterParams.nutritionParam?.carbParam;
  const proteinInitialState = filterParams.nutritionParam?.proteinParam;
  const fatInitialState = filterParams.nutritionParam?.fatParam;

  setNutrIdxRange(
    findIdxRange(
      calorieInitialState,
      carbInitialState,
      proteinInitialState,
      fatInitialState,
    ),
  );
};
