import {IBaseLine} from '../../query/types/baseLine';
import {IProductData} from '../../query/types/product';
import colors from '../../styles/colors';

interface TableItem {
  name: string;
  column1: string;
  column2: string;
  rate?: string;
  color?: string;
}

export const makeTableData = (
  food: IProductData | undefined,
  baseLineData: IBaseLine | undefined,
) => {
  if (!food) return [];
  const table: TableItem[] = [
    {
      name: 'calorie',
      column1: '칼로리',
      column2: `${food.calorie ? Math.ceil(Number(food.calorie)) : ''} kcal`,
      rate: baseLineData
        ? `${Math.ceil(
            (Number(food.calorie) / Number(baseLineData.calorie)) * 3 * 100,
          )}%`
        : '',
      color: colors.main,
    },
    {
      name: 'carb',
      column1: '탄수화물',
      column2: `${food.carb ? Math.ceil(Number(food.carb)) : ''} g`,
      rate: baseLineData
        ? `${Math.ceil(
            (Number(food.carb) / Number(baseLineData.carb)) * 3 * 100,
          )}%`
        : '',
      color: colors.blue,
    },
    {
      name: 'protein',
      column1: '단백질',
      column2: `${food.protein ? Math.ceil(Number(food.protein)) : ''} g`,
      rate: baseLineData
        ? `${Math.ceil(
            (Number(food.protein) / Number(baseLineData.protein)) * 3 * 100,
          )}%`
        : '',
      color: colors.green,
    },
    {
      name: 'fat',
      column1: '지방',
      column2: `${food.fat ? Math.ceil(Number(food.fat)) : ''} g`,
      rate: baseLineData
        ? `${Math.ceil(
            (Number(food.fat) / Number(baseLineData.fat)) * 3 * 100,
          )}%`
        : '',
      color: colors.orange,
    },
    {
      name: 'sodium',
      column1: '나트륨',
      column2: `${food.sodium ? Math.ceil(Number(food.sodium)) : ''} mg`,
      rate: baseLineData
        ? `${Math.ceil((Number(food.sodium) / 2300) * 100)}%`
        : '',
    },
    {
      name: 'sugar',
      column1: '당류',
      column2: `${food.sugar ? Math.ceil(Number(food.sugar)) : ''} g`,
      rate: baseLineData
        ? `${Math.ceil(
            (Number(food.sugar) / 0.2 / Number(baseLineData.calorie)) * 3 * 100,
          )}%`
        : '',
    },

    {
      name: 'transFat',
      column1: '트랜스지방',
      column2: `${food.transFat ? Math.ceil(Number(food.transFat)) : ''} g`,
      rate: baseLineData
        ? `${Math.ceil(
            (Number(food.transFat) / 0.1 / Number(baseLineData.calorie)) *
              3 *
              100,
          )}%`
        : '',
    },
    {
      name: 'saturatedFat',
      column1: '포화지방',
      column2: `${
        food.saturatedFat ? Math.ceil(Number(food.saturatedFat)) : ''
      } g`,
      rate: baseLineData
        ? `${Math.ceil(
            (Number(food.saturatedFat) / 0.7 / Number(baseLineData.calorie)) *
              3 *
              100,
          )}%`
        : '',
    },
    {
      name: 'cholesterol',
      column1: '콜레스테롤',
      column2: `${
        food.cholesterol ? Math.ceil(Number(food.cholesterol)) : ''
      } mg`,
      rate: baseLineData
        ? `${Math.ceil((Number(food.cholesterol) / 300) * 100)}%`
        : '',
    },

    {
      name: 'itemReportNo',
      column1: '품목보고번호',
      // itemReportNo 데이터 없으면 '-' 표시
      column2: `${food.manufacturerBizNo ? food.manufacturerBizNo : '-'}`,
    },
    {
      name: 'manufacturerNm',
      column1: '제조사',
      column2: `${food.manufacturerNm ? food.manufacturerNm : '-'}`,
    },
  ];
  return table;
};
