import {IBaseLine} from '../../query/types/baseLine';
import {IDietDetailData} from '../../query/types/diet';
import {IProductData, IProductsData} from '../../query/types/product';

interface IAutoMenu {
  totalFoodList: Array<IProductData>;
  dietDetail: Array<IProductData>;
  baseLine: IBaseLine;
  selectedCategory: number[];
  priceTarget: number[];
}

const getSum = (menu: IProductsData) => {
  // 1: cal | 2: carb | 3: protein | 4: fat | 5: price
  const sum = [0, 0, 0, 0, 0];
  menu.forEach(food => {
    sum[0] += parseInt(food.calorie);
    sum[1] += parseInt(food.carb);
    sum[2] += parseInt(food.protein);
    sum[3] += parseInt(food.fat);
    sum[4] += parseInt(food.price);
  });
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
  menu.forEach(food => {
    if (food.categoryCd === 'CG001') {
      cateogoryNum[0] += 1;
    } else if (food.categoryCd === 'CG002') cateogoryNum[1] += 1;
    else if (food.categoryCd === 'CG003') cateogoryNum[2] += 1;
    else if (food.categoryCd === 'CG004') cateogoryNum[3] += 1;
    else if (food.categoryCd === 'CG005') cateogoryNum[4] += 1;
    else if (food.categoryCd === 'CG006') cateogoryNum[5] += 1;
  });
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
  remainFoodNum?: number | undefined;
}
const getAvailableFoods = ({
  foods,
  menu,
  target,
  errorRange,
  remainFoodNum,
}: IGetAvailableFoods) => {
  if (foods.length === 0) return [];

  const sum = getSum(menu);
  const remain = getRemain(target, sum);

  // get available foods which foods element doesnt exceed remain element from totalFoodList
  const menuProductNoArr = menu.map(food => food.productNo);
  if (remainFoodNum === undefined)
    return foods.filter(
      food =>
        parseInt(food.calorie) <= remain[0] &&
        parseInt(food.carb) <= remain[1] &&
        parseInt(food.protein) <= remain[2] &&
        parseInt(food.fat) <= remain[3] &&
        parseInt(food.price) <= remain[4] &&
        menuProductNoArr.includes(food.productNo) === false,
    );

  const calorieLowestSum = getLowestSum(foods, remainFoodNum, 'calorie');
  const carbLowestSum = getLowestSum(foods, remainFoodNum, 'carb');
  const proteinLowestSum = getLowestSum(foods, remainFoodNum, 'protein');
  const fatLowestSum = getLowestSum(foods, remainFoodNum, 'fat');
  const priceLowestSum = getLowestSum(foods, remainFoodNum, 'price');

  // (menu + firstFood(있으면)와 합쳤을 때 [캍탄단지가격] 이
  // (remain - errorRange - 식품들 중 가장 작은 값 x개(다음에 추가할 식품 수) 합)보다 작은 식품 추가)
  if (remainFoodNum > 1) {
    return foods.filter(
      food =>
        parseInt(food.calorie) <=
          remain[0] + errorRange['calorie'][1] - calorieLowestSum &&
        parseInt(food.carb) <=
          remain[1] + errorRange['carb'][1] - carbLowestSum &&
        parseInt(food.protein) <=
          remain[2] + errorRange['protein'][1] - proteinLowestSum &&
        parseInt(food.fat) <= remain[3] + errorRange['fat'][1] - fatLowestSum &&
        parseInt(food.price) <= remain[4] - priceLowestSum &&
        menuProductNoArr.includes(food.productNo) === false,
    );
  }

  if (remainFoodNum === 1) {
    // 마지막 식품은 [칼탄단지가격] 다 범위 안에 들어와야함
    // 근데 일단 칼로리만 빡시게 맞춰보기
    return foods.filter(
      food =>
        parseInt(food.calorie) <= remain[0] + errorRange['calorie'][1] &&
        parseInt(food.calorie) >= remain[0] - errorRange['calorie'][0] &&
        parseInt(food.carb) <= remain[1] + errorRange['carb'][1] &&
        // parseInt(food.carb) >= remain[1] - errorRange['carb'][0] &&
        parseInt(food.protein) <= remain[2] + errorRange['protein'][1] &&
        // parseInt(food.protein) >= remain[2] - errorRange['protein'][0] &&
        parseInt(food.fat) <= remain[3] + errorRange['fat'][1] &&
        // parseInt(food.fat) >= remain[3] - errorRange['fat'][0] &&
        parseInt(food.price) <= remain[4] &&
        menuProductNoArr.includes(food.productNo) === false,
    );
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

  console.log('shuffle전: ', foods[0].productNm);
  shuffle(foods);
  console.log('shuffle후: ', foods[0].productNm);

  foods.forEach(food => {
    if (food.categoryCd === 'CG001') {
      sortedFoods[0].push(food);
    } else if (food.categoryCd === 'CG002') sortedFoods[1].push(food);
    else if (food.categoryCd === 'CG003') sortedFoods[2].push(food);
    else if (food.categoryCd === 'CG004') sortedFoods[3].push(food);
    else if (food.categoryCd === 'CG005') sortedFoods[4].push(food);
    else if (food.categoryCd === 'CG006') sortedFoods[5].push(food);
  });

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
  categoryNum: number[],
  availableFoods: IProductsData,
  selectedCategory: number[],
  unitNo: number,
  remainFoodNum: number,
) => {
  const sum = getSum(menu);
  const sortedFoods = sortFoodsByCategory(availableFoods);

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

  const errorRange = {
    cal: [-50, 50],
    carb: [-15, 15],
    protein: [-5, 5],
    fat: [-3, 3],
  };

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

  initialAvailableFoods = getAvailableFoods({
    foods: initialAvailableFoods,
    menu: initialMenu,
    target: target,
    errorRange: errorRange,
    remainFoodNum: initialRemainFoodNum,
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

const getFirstFood = (
  availableFoods: IProductsData,
  selectedCategory: number[],
) => {
  const sortedFoods = sortFoodsByCategory(availableFoods);
  if (!checkIsRecommendAvailable(sortedFoods, selectedCategory))
    return undefined;

  const randomCategoryIdx = Math.floor(Math.random() * selectedCategory.length);
  const pickedCategory = sortedFoods[randomCategoryIdx];
  const randomFoodIdx = Math.floor(Math.random() * pickedCategory.length);

  return pickedCategory[randomFoodIdx];
};

const getSecondFood = (
  availableFoods: IProductsData,
  selectedCategory: number[],
  unitCalorie: number,
) => {
  const availableSecondFoods = availableFoods.filter(
    food =>
      parseInt(food.calorie) <= unitCalorie + 20 &&
      parseInt(food.calorie) >= unitCalorie - 20,
  );
  if (availableSecondFoods.length === 0) return undefined;
  const sortedFoods = sortFoodsByCategory(availableSecondFoods);
  if (!checkIsRecommendAvailable(sortedFoods, selectedCategory))
    return undefined;

  shuffle(selectedCategory);
  console.log('getSecondFood: shuffled selectedCategory:', selectedCategory);

  return sortedFoods[selectedCategory[0]][0];
};

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
        reject(new Error('앱을 다시 실행해 주세요'));

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
        reject(new Error('만족하는 식품이 없습니다'));

      // sortedFoods는 initialize 필요 없이 사용직전에 만들어서 쓰기
      let menu = [...initialMenu];
      let categoryNum = [...initialCategoryNum];
      let availableFoods = [...initialAvailableFoods];
      let remainFoodNum = initialRemainFoodNum;

      // initial check log
      printLog(
        initialMenu,
        initialCategoryNum,
        initialAvailableFoods,
        selectedCategory,
        unitNo,
        initialRemainFoodNum,
      );

      // check is recommend available
      if (!checkIsRecommendAvailable(initialSortedFoods, selectedCategory)) {
        reject(new Error('만족하는 식품이 없습니다'));
      }

      let isRecommendComplete = false;
      while (!isRecommendComplete) {
        // 식품 1개 or 2개 추가하는게 한 추천 unit으로 정함
        // 마지막을 제외한 unit들의 칼로리는 전체 식품의 최대+최소칼로리 -> 식품2개
        // 마지막 unit인 경우는 랜덤으로 1개 or 2개 추가
        // ----------------------------------------------------------- //
        // - 마지막 unit이 아닌 경우 => 유닛 당 식품 2개씩 추가
        // 1. getFirstFood (랜덤으로 1개 추가)
        // 2. getSecondFood (menu + firstFood와 합쳤을 때 [캍탄단지가격] 이
        // (remain - 최소값 * 다음에 추가할 식품 수)보다 작은 식품 추가)
        // 3. 식품 다 돌려봤는데 조합 안나오면 initialize!
        // - 마지막 unit인 경우 => 랜덤으로 1개 or 2개 식품 추가
        // -- 1개추가
        // 1. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu)과 비교해서 )
        // [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
        // 2. availableFoods없거나 다 돌렸는데 없으면 initialize
        // -- 2개추가
        // 1. getFirstFood (랜덤으로 1개 추가)
        // 2. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu + firstFood)과 비교해서 )
        // [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
        // 3. availableFoods없거나 다 돌렸는데 없으면 initialize
        // ----------------------------------------------------------- //

        for (let i = 0; i < unitNo; i++) {
          printLog(
            menu,
            categoryNum,
            availableFoods,
            selectedCategory,
            unitNo,
            remainFoodNum,
          );
          // - 마지막 unit이 아닌 경우 => 유닛 당 식품 2개씩 추가
          if (i !== unitNo - 1) {
            let isUnitComplete = false;
            while (!isUnitComplete) {
              let tempFoods: IProductsData = [];
              // 1. getFirstFood (랜덤으로 1개 추가)
              if (i !== 0) {
                availableFoods = getAvailableFoods({
                  foods: availableFoods,
                  menu,
                  target,
                  errorRange,
                  remainFoodNum,
                });
                if (availableFoods.length === 0) {
                  // initialize
                  ({menu, categoryNum, availableFoods, remainFoodNum} = {
                    menu: [...initialMenu],
                    categoryNum: [...initialCategoryNum],
                    availableFoods: [...initialAvailableFoods],
                    remainFoodNum: unitNo * 2,
                  });
                  break;
                }
              }
              const firstFood = getFirstFood(availableFoods, selectedCategory);
              if (!firstFood) {
                // initialize
                ({menu, categoryNum, availableFoods, remainFoodNum} = {
                  menu: [...initialMenu],
                  categoryNum: [...initialCategoryNum],
                  availableFoods: [...initialAvailableFoods],
                  remainFoodNum: unitNo * 2,
                });
                break;
              }
              tempFoods.push(firstFood);

              // 2. getSecondFood (firstFood와 합쳤을 때 [캍탄단지가격] 이
              // (remain - 최소값 * 다음에 추가할 식품 수)보다 작은 식품 추가)
              // getSecondFood나 getLastFood 에서 필요
              const tempMenu = [...tempFoods, ...menu];
              const tempAvailableFoods = getAvailableFoods({
                foods: availableFoods,
                menu: tempMenu,
                target,
                errorRange,
                remainFoodNum: remainFoodNum - 1,
              });
              const secondFood = getSecondFood(
                tempAvailableFoods,
                selectedCategory,
                unitCalorie,
              );
              if (!secondFood) {
                // initialize -> 해당 유닛만 반복
                break;
              }

              tempFoods.push(secondFood);
              isUnitComplete = true;
              remainFoodNum -= 2;
            }
            if (!isUnitComplete) break;

            // 3. 식품 다 돌려봤는데 조합 안나오면 initialize!
          }
          // - 마지막 unit인 경우 => 랜덤으로 1개 or 2개 식품 추가
          if (i === unitNo - 1) {
            // -- 1개추가
            const lastUnitFoodNum = Math.ceil(Math.random() * 2);
            console.log('lastUnitFoodNum', lastUnitFoodNum);
            if (lastUnitFoodNum === 1) {
              // 1. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu)과 비교해서 )
              // [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
              // 2. availableFoods없거나 다 돌렸는데 없으면 initialize
            }

            // -- 2개추가
            if (lastUnitFoodNum === 2) {
              // 1. getFirstFood (랜덤으로 1개 추가)
              // 2. getLastFood (현재 전체 추가된 식품들 (foodDetail + menu + firstFood)과 비교해서 )
              // [칼탄단지가격]을 모두 만족시키는 마지막 식품 1개 추가
              // 3. availableFoods없거나 다 돌렸는데 없으면 initialize
            }
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
