import {NUTR_ERROR_RANGE} from '../../constants/constants';
import {IBaseLine} from '../../query/types/baseLine';
import {IProductData, IProductsData} from '../../query/types/product';

const RECOMMEND_TRY = 100;
const UNIT_TRY = 50;
const ERROR_RANGE = NUTR_ERROR_RANGE;

const getSum = (menu: IProductsData) => {
  // 1: cal | 2: carb | 3: protein | 4: fat | 5: price
  const sum = [0, 0, 0, 0, 0];
  for (let i = 0; i < menu.length; i++) {
    sum[0] += parseInt(menu[i].calorie);
    sum[1] += parseInt(menu[i].carb);
    sum[2] += parseInt(menu[i].protein);
    sum[3] += parseInt(menu[i].fat);
    sum[4] += parseInt(menu[i].price);
  }
  return sum;
};
const getRemain = (target: number[], sum: number[]) => {
  let remain = [];
  for (let i = 0; i < sum.length; i++) {
    remain[i] = target[i] ? target[i] - sum[i] : 0;
  }
  return remain;
};

const getCategoryNum = (menu: IProductsData) => {
  // 0: 도시락 | 1: 닭가슴살 | 2: 샐러드 | 3: 영양간식 | 4: 과자 | 5: 음료
  let cateogoryNum = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].categoryCd === 'CG001') {
      cateogoryNum[0] += 1;
    } else if (menu[i].categoryCd === 'CG002') cateogoryNum[1] += 1;
    else if (menu[i].categoryCd === 'CG003') cateogoryNum[2] += 1;
    else if (menu[i].categoryCd === 'CG004') cateogoryNum[3] += 1;
    else if (menu[i].categoryCd === 'CG005') cateogoryNum[4] += 1;
    else if (menu[i].categoryCd === 'CG006') cateogoryNum[5] += 1;
  }

  return cateogoryNum;
};

const getLowestSum = (
  availableFoods: IProductsData,
  num: number,
  type: 'calorie' | 'carb' | 'protein' | 'fat' | 'price',
) => {
  let foodsToCheck = [...availableFoods];
  const lowestCalFoods: IProductsData = [];
  for (let i = 0; i < num; i++) {
    const lowest = foodsToCheck.reduce((prev, curr) => {
      return parseInt(prev[type]) < parseInt(curr[type]) ? prev : curr;
    });
    lowestCalFoods.push(lowest);
    foodsToCheck = foodsToCheck.filter(
      food => food.productNo !== lowest.productNo,
    );
  }
  return lowestCalFoods.reduce((acc, cur) => acc + parseInt(cur[type]), 0);
};

interface IGetAvailableFoods {
  foods: IProductsData;
  menu: IProductsData;
  target: number[];
  errorRange: {[key: string]: number[]};
  initialRemainFoodNum?: number;
  remainFoodNum?: number;
  unitCalorie?: number;
  currentUnitIdx?: number;
}
export const getAvailableFoods = ({
  foods,
  menu,
  target,
  errorRange,
  initialRemainFoodNum,
  remainFoodNum,
  unitCalorie,
  currentUnitIdx = 0,
}: IGetAvailableFoods) => {
  // console.log('getAvailableFoods: remainFooNum:', remainFoodNum);

  if (foods.length === 0) return [];
  const sum = getSum(menu);
  const remain = getRemain(target, sum);
  console.log('---- getAvailableFoods ----');
  console.log(
    'unit: ',
    currentUnitIdx + 1,
    'remainFoodNum: ',
    remainFoodNum,
    'getAvailable: ',
    remain,
  );

  const menuProductNoArr = menu.map(food => food.productNo);

  // 초기화 할 때
  if (
    remainFoodNum === undefined ||
    initialRemainFoodNum === undefined ||
    unitCalorie === undefined
  ) {
    let filteredFoods = [];
    for (let i = 0; i < foods.length; i++) {
      if (
        parseInt(foods[i].calorie) <= remain[0] &&
        parseInt(foods[i].carb) <= remain[1] &&
        parseInt(foods[i].protein) <= remain[2] &&
        parseInt(foods[i].fat) <= remain[3] &&
        parseInt(foods[i].price) <= remain[4] &&
        menuProductNoArr.includes(foods[i].productNo) === false
      ) {
        filteredFoods.push(foods[i]);
      }
    }
    return filteredFoods;
  }

  const calorieLowestSum = getLowestSum(foods, remainFoodNum, 'calorie');
  const carbLowestSum = getLowestSum(foods, remainFoodNum, 'carb');
  const proteinLowestSum = getLowestSum(foods, remainFoodNum, 'protein');
  const fatLowestSum = getLowestSum(foods, remainFoodNum, 'fat');
  const priceLowestSum = getLowestSum(foods, remainFoodNum, 'price');

  // (menu + firstFood(있으면)와 합쳤을 때 [캍탄단지가격] 이
  // (remain - errorRange - 식품들 중 가장 작은 값 x개(다음에 추가할 식품 수) 합)보다 작은 식품 추가)
  if (remainFoodNum > 1) {
    const isSecond = (initialRemainFoodNum - remainFoodNum + 1) % 2 === 0;

    if (isSecond) {
      const remainCalorie = unitCalorie - sum[0];
      const filteredFoods = [];
      for (let i = 0; i < foods.length; i++) {
        if (
          (parseInt(foods[i].calorie) <= remainCalorie + 20 &&
            parseInt(foods[i].calorie) >= remainCalorie - 20,
          menuProductNoArr.includes(foods[i].productNo) === false)
        ) {
          filteredFoods.push(foods[i]);
        }
      }
      console.log(
        'unit: ',
        currentUnitIdx + 1,
        'second availableLength: ',
        filteredFoods.length,
      );
      return filteredFoods;
    } else {
      const filteredFoods = [];
      for (let i = 0; i < foods.length; i++) {
        if (
          parseInt(foods[i].calorie) <= remain[0] - calorieLowestSum &&
          parseInt(foods[i].carb) <= remain[1] - carbLowestSum &&
          parseInt(foods[i].protein) <= remain[2] - proteinLowestSum &&
          parseInt(foods[i].fat) <= remain[3] - fatLowestSum &&
          parseInt(foods[i].price) <= remain[4] - priceLowestSum &&
          menuProductNoArr.includes(foods[i].productNo) === false
        ) {
          filteredFoods.push(foods[i]);
        }
      }
      console.log(
        'unit: ',
        currentUnitIdx + 1,
        'first availableLength: ',
        filteredFoods.length,
      );
      return filteredFoods;
    }
  }
  if (remainFoodNum === 1) {
    // 마지막 식품은 [칼탄단지가격] 다 범위 안에 들어와야함
    // 근데 일단 칼로리만 빡시게 맞춰보기
    const filteredFoods = [];
    for (let i = 0; i < foods.length; i++) {
      if (
        parseInt(foods[i].calorie) <= remain[0] + errorRange['calorie'][1] &&
        parseInt(foods[i].calorie) >= remain[0] + errorRange['calorie'][0] &&
        parseInt(foods[i].carb) <= remain[1] + errorRange['carb'][1] &&
        // parseInt(foods[i].carb) >= remain[1] - errorRange['carb'][0] &&
        parseInt(foods[i].protein) <= remain[2] + errorRange['protein'][1] &&
        // parseInt(foods[i].protein) >= remain[2] - errorRange['protein'][0] &&
        parseInt(foods[i].fat) <= remain[3] + errorRange['fat'][1] &&
        // parseInt(foods[i].fat) >= remain[3] - errorRange['fat'][0] &&
        parseInt(foods[i].price) <= remain[4] &&
        menuProductNoArr.includes(foods[i].productNo) === false
      ) {
        filteredFoods.push(foods[i]);
      }
    }
    console.log(
      'unit: ',
      currentUnitIdx + 1,
      'last availableLength: ',
      filteredFoods.length,
    );
    return filteredFoods;
  } else {
    return [];
  }
};

const shuffle = (arr: any) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const sortFoodsByCategory = (foods: IProductsData) => {
  // sort foods by category which is CG001 ~ CG006
  const categoryLength = 6;
  const sortedFoods: IProductsData[] = Array.from(
    {length: categoryLength},
    () => [],
  );

  shuffle(foods);

  for (let i = 0; i < foods.length; i++) {
    if (foods[i].categoryCd === 'CG001') {
      sortedFoods[0].push(foods[i]);
    } else if (foods[i].categoryCd === 'CG002') sortedFoods[1].push(foods[i]);
    else if (foods[i].categoryCd === 'CG003') sortedFoods[2].push(foods[i]);
    else if (foods[i].categoryCd === 'CG004') sortedFoods[3].push(foods[i]);
    else if (foods[i].categoryCd === 'CG005') sortedFoods[4].push(foods[i]);
    else if (foods[i].categoryCd === 'CG006') sortedFoods[5].push(foods[i]);
  }

  return sortedFoods;
};

const checkIsRecommendAvailable = (
  sortedFoods: IProductsData[],
  selectedCategory: number[],
) => {
  let foodsToCheck = [];
  for (let i = 0; i < selectedCategory.length; i++) {
    foodsToCheck.push(sortedFoods[selectedCategory[i]]);
  }
  return foodsToCheck.some(food => food.length > 0);
};

const printLog = (
  menu: IProductsData,
  availableFoods: IProductsData,
  selectedCategory: number[],
  unitNo: number,
  remainFoodNum: number,
  recommendTry: number,
  unitTry: number,
  lastUnitTry: number,
) => {
  const sum = getSum(menu);
  const sortedFoods = sortFoodsByCategory(availableFoods);
  const categoryNum = getCategoryNum(menu);

  console.log(
    'menu length: ',
    menu.length,
    '||||| categoryNum: ',
    categoryNum,
    '||||| sum: ',
    sum,
    '||||| availableFoods length: ',
    availableFoods?.length,
    '||||| isRecommednAvailable: ',
    checkIsRecommendAvailable(sortedFoods, selectedCategory),
    '||||| unitNo: ',
    unitNo,
    '||||| remainFoodNum: ',
    remainFoodNum,
    '||||| recommendTry: ',
    recommendTry,
    '||||| unitTry: ',
    unitTry,
    '||||| lastUnitTry: ',
    lastUnitTry,
  );
};

const getMinMax = (
  arr: IProductsData,
  nutr: 'calorie' | 'carb' | 'protein' | 'fat',
) => {
  const minFood = arr.reduce((prev, curr) => {
    return parseInt(prev[nutr]) < parseInt(curr[nutr]) ? prev : curr;
  });

  const maxFood = arr.reduce((prev, curr) => {
    return parseInt(prev[nutr]) > parseInt(curr[nutr]) ? prev : curr;
  });
  return [parseInt(minFood[nutr]), parseInt(maxFood[nutr])];
};

const initialize = (
  baseLine: IBaseLine,
  dietDetail: IProductsData,
  priceTarget: number[],
  totalFoodList: IProductsData,
) => {
  // 0: cal | 1: carb | 2: protein | 3: fat | 4: price

  const errorRange = ERROR_RANGE;

  const target = [
    parseInt(baseLine.calorie),
    parseInt(baseLine.carb),
    parseInt(baseLine.protein),
    parseInt(baseLine.fat),
    priceTarget[1],
  ];

  const initialMenu = [...dietDetail];
  const initialCategoryNum = getCategoryNum(initialMenu);
  const initialSum = getSum(initialMenu);
  const initialRemain = getRemain(target, initialSum);
  // const calRange = [20, 457];
  // const carbRange = [0, 77];
  // const proteinRange = [1, 41];
  // const fatRange = [0, 19];

  let initialAvailableFoods = getAvailableFoods({
    foods: totalFoodList,
    menu: initialMenu,
    target: target,
    errorRange: errorRange,
  });

  if (initialAvailableFoods.length === 0)
    return {
      target: [],
      initialMenu: [],
      initialCategoryNum: [],
      initialAvailableFoods: [],
      initialSortedFoods: [],
      unitCalorie: 0,
      unitNo: 0,
      initialRemainFoodNum: 0,
      errorRange,
    };

  const initialSortedFoods =
    initialAvailableFoods && sortFoodsByCategory(initialAvailableFoods);

  const initialCalMinMax = getMinMax(initialAvailableFoods, 'calorie');
  const unitCalorie = initialCalMinMax[0] + initialCalMinMax[1];
  const unitNo = Math.ceil(initialRemain[0] / unitCalorie);
  const initialRemainFoodNum = unitNo * 2 - Math.floor(Math.random() * 2);
  console.log('initialRemainFoodNum :', initialRemainFoodNum);

  initialAvailableFoods = getAvailableFoods({
    foods: initialAvailableFoods,
    menu: initialMenu,
    target: target,
    errorRange: errorRange,
    initialRemainFoodNum,
    remainFoodNum: initialRemainFoodNum,
    unitCalorie,
  });

  return {
    target,
    initialMenu,
    initialCategoryNum,
    initialAvailableFoods,
    initialSortedFoods,
    unitCalorie,
    unitNo,
    initialRemainFoodNum,
    errorRange,
  };
};

const pickFood = (
  availableFoods: IProductsData,
  selectedCategory: number[],
) => {
  const sortedFoods = sortFoodsByCategory(availableFoods);
  if (!checkIsRecommendAvailable(sortedFoods, selectedCategory))
    return undefined;

  shuffle(selectedCategory);
  return sortedFoods[selectedCategory[0]][0];
};

interface IAutoMenu {
  totalFoodList: Array<IProductData>;
  dietDetail: Array<IProductData>;
  baseLine: IBaseLine | undefined;
  selectedCategory: number[];
  priceTarget: number[];
}
export const makeAutoMenu = ({
  totalFoodList,
  dietDetail,
  baseLine,
  selectedCategory,
  priceTarget,
}: IAutoMenu): Promise<{
  sumNutr: number[];
  sumPrice: number;
  recommendedFoods: IProductsData;
}> => {
  return new Promise((resolve, reject) => {
    try {
      if (!baseLine || !dietDetail || !totalFoodList)
        return reject(new Error('앱을 다시 실행해 주세요'));

      const {
        target,
        initialMenu,
        initialCategoryNum,
        initialAvailableFoods,
        initialSortedFoods,
        unitCalorie,
        unitNo,
        initialRemainFoodNum,
        errorRange,
      } = initialize(baseLine, dietDetail, priceTarget, totalFoodList);

      if (initialAvailableFoods.length === 0)
        return reject(new Error('만족하는 식품이 없습니다'));

      // sortedFoods는 initialize 필요 없이 사용직전에 만들어서 쓰기
      let menu = [...initialMenu];
      let availableFoods = [...initialAvailableFoods];
      let remainFoodNum = initialRemainFoodNum;

      let unitTry = 0;
      let lastUnitTry = 0;
      // initial check log

      // check is recommend available
      if (!checkIsRecommendAvailable(initialSortedFoods, selectedCategory))
        return reject(new Error('만족하는 식품이 없습니다'));

      let isRecommendComplete = false;

      let recommendTry = 0;
      while (!isRecommendComplete) {
        recommendTry += 1;
        console.log('recommendTry: ', recommendTry);
        if (recommendTry > RECOMMEND_TRY) {
          return reject(
            new Error(`만족하는 식품이 없습니다. rTry: ${recommendTry}`),
          );
        }
        /**
         * 식품 1개 or 2개 추가하는게 한 unit으로 정함
         * 마지막을 제외한 unit들의 칼로리는 전체 식품의 최대+최소칼로리 -> 식품2개
         * 마지막 unit인 경우는 랜덤으로 1개 or 2개 추가
         * ----------------------------------------------------------- //
         * - 마지막 unit이 아닌 경우 => 유닛 당 식품 2개씩 추가
         * 1. getFirstFood (랜덤으로 1개 추가)
         * 2. getSecondFood (menu + firstFood와 합쳤을 때 [캍탄단지가격] 이
         * (remain - 최소값 * 다음에 추가할 식품 수)보다 작은 식품 추가)
         * 3. 식품 다 돌려봤는데 조합 안나오면 initialize!
         * - 마지막 unit인 경우 => 랜덤으로 1개 or 2개 식품 추가
         * -- 1개추가
         * 1. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu)과 비교해서 )
         * [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
         * 2. availableFoods없거나 다 돌렸는데 없으면 initialize
         * -- 2개추가
         * 1. getFirstFood (랜덤으로 1개 추가)
         * 2. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu + firstFood)과 비교해서 )
         * [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
         * 3. availableFoods없으면 해당 유닛만 반복 -> 횟수 초과하면 initialize
         * ----------------------------------------------------------- //
         */

        for (let i = 0; i < unitNo; i++) {
          console.log('unit: ', i + 1);
          let isUnitComplete = false;
          // - 마지막 unit이 아닌 경우 => 유닛 당 식품 2개씩 추가
          if (i !== unitNo - 1) {
            unitTry = 0;
            while (!isUnitComplete) {
              unitTry += 1;
              if (unitTry > UNIT_TRY) {
                console.log('unitTry 초과', unitTry);
                ({menu, availableFoods, remainFoodNum} = {
                  menu: [],
                  availableFoods: [...initialAvailableFoods],
                  remainFoodNum: initialRemainFoodNum,
                });
                unitTry = 0;
                break;
              }
              // 1. getFirstFood (랜덤으로 1개 추가)
              if (i !== 0) {
                // 처음 unit이 아니면 available새로 가져오기
                availableFoods = getAvailableFoods({
                  foods: availableFoods,
                  menu: [...initialMenu, ...menu],
                  target,
                  errorRange,
                  initialRemainFoodNum,
                  remainFoodNum,
                  unitCalorie,
                  currentUnitIdx: i,
                });
              }
              const firstFood = pickFood(availableFoods, selectedCategory);
              if (!firstFood) {
                // initialize
                ({menu, availableFoods, remainFoodNum} = {
                  menu: [],
                  availableFoods: [...initialAvailableFoods],
                  remainFoodNum: initialRemainFoodNum,
                });
                break;
              }
              console.log('---- firstFood 추가 ----');
              console.log('unit: ', i + 1, 'firstFood: ', firstFood?.productNm);
              // 2. getSecondFood (firstFood와 합쳤을 때 [캍탄단지가격] 이
              // (remain - 최소값 * 다음에 추가할 식품 수)보다 작은 식품 추가)
              // getSecondFood나 getLastFood 에서 필요
              const tempMenu = [...initialMenu, ...menu, firstFood];
              const tempAvailableFoods = getAvailableFoods({
                foods: availableFoods,
                menu: tempMenu,
                target,
                errorRange,
                initialRemainFoodNum,
                remainFoodNum: remainFoodNum - 1,
                unitCalorie,
                currentUnitIdx: i,
              });
              const secondFood = pickFood(tempAvailableFoods, selectedCategory);

              // secondFood 없으면 현재 유닛만 반복
              if (!secondFood) continue;

              // unit complete
              isUnitComplete = true;
              let addedMenu = [...menu, firstFood, secondFood];
              menu = [...addedMenu];
              remainFoodNum -= 2;
              console.log(i + 1, ': unit complete : try', unitTry);
              unitTry = 0;
              printLog(
                [...initialMenu, ...menu],
                availableFoods,
                selectedCategory,
                unitNo,
                remainFoodNum,
                recommendTry,
                unitTry,
                lastUnitTry,
              );
            }
            if (!isUnitComplete) break;
          }
          // - 마지막 unit인 경우 => 랜덤으로 1개 or 2개 식품 추가 (첫 initialize 당시 정해짐)
          if (i === unitNo - 1) {
            // -- 1개추가

            if (remainFoodNum === 1) {
              // 1. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu)과 비교해서 )
              // [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
              const tempAvailableFoods = getAvailableFoods({
                foods: availableFoods,
                menu: [...initialMenu, ...menu],
                target,
                errorRange,
                initialRemainFoodNum,
                remainFoodNum,
                unitCalorie,
                currentUnitIdx: i,
              });
              const lastFood = pickFood(tempAvailableFoods, selectedCategory);

              if (!lastFood) {
                // 2. lastFood 안나오면 initialize
                ({menu, availableFoods, remainFoodNum} = {
                  menu: [],
                  availableFoods: [...initialAvailableFoods],
                  remainFoodNum: initialRemainFoodNum,
                });
                break;
              }
              // unit complete, recommend complete
              isUnitComplete = true;
              isRecommendComplete = true;
              menu = [...menu, lastFood];
              remainFoodNum -= 1;
              console.log(i, ': unit complete, 마지막 1개 recommend complete');
              printLog(
                [...initialMenu, ...menu],
                availableFoods,
                selectedCategory,
                unitNo,
                remainFoodNum,
                recommendTry,
                unitTry,
                lastUnitTry,
              );
              let resultSum = getSum([...initialMenu, ...menu]);
              return resolve({
                sumNutr: resultSum.slice(0, 5),
                sumPrice: resultSum[5],
                recommendedFoods: menu,
              });
            }

            // -- 2개추가
            if (remainFoodNum === 2) {
              let isLastUnitComplete = false;
              lastUnitTry = 0;
              while (!isLastUnitComplete) {
                lastUnitTry += 1;
                if (lastUnitTry > UNIT_TRY) {
                  console.log('lastUnitTry 초과', unitTry);
                  ({menu, availableFoods, remainFoodNum} = {
                    menu: [],
                    availableFoods: [...initialAvailableFoods],
                    remainFoodNum: initialRemainFoodNum,
                  });
                  lastUnitTry = 0;
                  break;
                }
                // 1. getFirstFood
                availableFoods = getAvailableFoods({
                  foods: availableFoods,
                  menu: [...initialMenu, ...menu],
                  target,
                  errorRange,
                  initialRemainFoodNum,
                  remainFoodNum,
                  unitCalorie,
                  currentUnitIdx: i,
                });
                const firstFood = pickFood(availableFoods, selectedCategory);
                if (!firstFood) {
                  // initialize
                  ({menu, availableFoods, remainFoodNum} = {
                    menu: [],
                    availableFoods: [...initialAvailableFoods],
                    remainFoodNum: initialRemainFoodNum,
                  });
                  break;
                }

                // 2. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu + firstFood)과 비교해서 )
                // [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
                const tempMenu = [...menu, firstFood];
                const tempAvailableFoods = getAvailableFoods({
                  foods: availableFoods,
                  menu: [...initialMenu, ...tempMenu],
                  target,
                  errorRange,
                  initialRemainFoodNum,
                  remainFoodNum: remainFoodNum - 1,
                  unitCalorie,
                  currentUnitIdx: i,
                });
                const lastFood = pickFood(tempAvailableFoods, selectedCategory);
                // 2. lastFood 안나오면 마지막 unit만 반복
                if (!lastFood) continue;

                // unit complete, lastUnit complete
                isUnitComplete = true;
                isLastUnitComplete = true;
                isRecommendComplete = true;
                let addedMenu = [...menu, firstFood, lastFood];
                menu = [...addedMenu];
                remainFoodNum -= 2;
                lastUnitTry = 0;

                console.log(
                  i,
                  ': unit complete, 마지막 2개 recommend complete try:',
                  lastUnitTry,
                );
                printLog(
                  [...initialMenu, ...menu],
                  availableFoods,
                  selectedCategory,
                  unitNo,
                  remainFoodNum,
                  recommendTry,
                  unitTry,
                  lastUnitTry,
                );
                let resultSum = getSum([...initialMenu, ...menu]);
                return resolve({
                  sumNutr: resultSum.slice(0, 5),
                  sumPrice: resultSum[5],
                  recommendedFoods: menu,
                });
              }
              if (!isLastUnitComplete) break;
            }
          }
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
};
