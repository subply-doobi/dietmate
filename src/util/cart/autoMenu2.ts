import {min} from 'react-native-reanimated';
import {NUTR_ERROR_RANGE} from '../../constants/constants';
import {IBaseLine} from '../../query/types/baseLine';
import {IProductData, IProductsData} from '../../query/types/product';

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
  // 카테고리 => 0: 도시락 | 1: 닭가슴살 | 2: 샐러드 | 3: 영양간식 | 4: 과자 | 5: 음료
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

const isFoodIncluded = (
  currentMenu: Array<IProductData>,
  food: IProductData,
) => {
  for (let i = 0; i < currentMenu.length; i++) {
    if (currentMenu[i].productNo === food.productNo) return true;
  }
  return false;
};

const isCategoryIncluded = (
  selectedCategoryIdx: number[],
  category: string,
) => {
  const selectedCategory = [
    'CG001',
    'CG002',
    'CG003',
    'CG004',
    'CG005',
    'CG006',
  ];

  for (let i = 0; i < selectedCategoryIdx.length; i++) {
    if (selectedCategory[i] === category) return true;
  }
  return false;
};

const getLimitedCategory = (
  selectedCategoryIdx: number[],
  currentMenu: IProductData[],
) => {
  const categoryNum = getCategoryNum(currentMenu);
  let limitedCategory = [];

  // 1. 도시락 | 2. 닭가슴살 | 3. 샐러드 | 4. 영양간식 | 5. 과자 | 6. 음료
  // limit : 도시락 1개 | 닭가슴살 2개 | 샐러드 1개 | 간식 2개 | 과자 1개 | 음료 1개
  const DOSIRAK_LIMIT = 1;
  const DAKGASM_LIMIT = 2;
  const SALAD_LIMIT = 1;
  const GANSIK_LIMIT = 2;
  const GWAJA_LIMIT = 1;
  const DRINK_LIMIT = 1;

  let isAllLimited = true;
  let i = 1;
  do {
    if (categoryNum[0] >= DOSIRAK_LIMIT * i) limitedCategory.push(0);
    if (categoryNum[1] >= DAKGASM_LIMIT * i) limitedCategory.push(1);
    if (categoryNum[2] >= SALAD_LIMIT * i) limitedCategory.push(2);
    if (categoryNum[3] >= GANSIK_LIMIT * i) limitedCategory.push(3);
    if (categoryNum[4] >= GWAJA_LIMIT * i) limitedCategory.push(4);
    if (categoryNum[5] >= DRINK_LIMIT * i) limitedCategory.push(5);

    for (let j = 0; j < selectedCategoryIdx.length; j++) {
      if (!limitedCategory.includes(selectedCategoryIdx[j])) {
        isAllLimited = false;
        break;
      }
    }
    if (isAllLimited) {
      console.log('isAllLimited');
      limitedCategory = [];
    }
    i++;
  } while (isAllLimited);

  return limitedCategory;
};

const isLimitedCategory = (limitedCategory: number[], category: string) => {
  const categoryIdxToSeq = [
    'CG001',
    'CG002',
    'CG003',
    'CG004',
    'CG005',
    'CG006',
  ];
  for (let i = 0; i < limitedCategory.length; i++) {
    if (categoryIdxToSeq[limitedCategory[i]] === category) return true;
  }
  return false;
};

interface IGetAvailableFoods {
  foods: IProductsData;
  currentMenu: IProductsData;
  target: number[];
  selectedCategoryIdx?: number[];
  targetNum: number;
  currentNum: number;
}
const getAvailableFoods = ({
  foods,
  currentMenu,
  target,
  selectedCategoryIdx = [0, 1, 2, 3, 4, 5],
  targetNum,
  currentNum,
}: IGetAvailableFoods) => {
  const isForLastFood =
    targetNum !== undefined &&
    currentNum !== undefined &&
    targetNum === currentNum + 1;

  let availableFoods = [];
  const remain = getRemain(target, getSum(currentMenu));
  const limitedCategory = getLimitedCategory(selectedCategoryIdx, currentMenu);

  let err: number[] = [];
  let minErrScore: number | undefined = undefined;
  if (!isForLastFood) {
    // 마지막 식품이 아닌 경우 : remain + 오차범위 최대값 - 이후 추가될 식품들 개수의 최소nutr 이하 식품들 가져오기
    // 4개 추천해주기로 했는데 현재1개 추가되어있고 지금 2개째 추천하는 거라면 2개 더 추가해야 하니까 최소값2개 빼주기

    const minCal = getLowestSum(foods, targetNum - currentNum - 1, 'calorie');
    const minCarb = getLowestSum(foods, targetNum - currentNum - 1, 'carb');
    const minProtein = getLowestSum(
      foods,
      targetNum - currentNum - 1,
      'protein',
    );
    const minFat = getLowestSum(foods, targetNum - currentNum - 1, 'fat');

    for (let i = 0; i < foods.length; i++) {
      if (
        isFoodIncluded(currentMenu, foods[i]) ||
        !isCategoryIncluded(selectedCategoryIdx, foods[i].categoryCd) ||
        isLimitedCategory(limitedCategory, foods[i].categoryCd)
      )
        continue;
      if (
        parseInt(foods[i].calorie) <=
          remain[0] + NUTR_ERROR_RANGE.calorie[1] - minCal &&
        parseInt(foods[i].carb) <=
          remain[1] + NUTR_ERROR_RANGE.carb[1] - minCarb &&
        parseInt(foods[i].protein) <=
          remain[2] + NUTR_ERROR_RANGE.protein[1] - minProtein &&
        parseInt(foods[i].fat) <=
          remain[3] + NUTR_ERROR_RANGE.fat[1] - minFat &&
        parseInt(foods[i].price) <= remain[4]
      )
        availableFoods.push(foods[i]);
    }
  } else if (isForLastFood) {
    let tempFoods = [];
    // target + 오차범위 내 식품들 가져오기
    for (let i = 0; i < foods.length; i++) {
      if (
        isFoodIncluded(currentMenu, foods[i]) ||
        !isCategoryIncluded(selectedCategoryIdx, foods[i].categoryCd) ||
        isLimitedCategory(limitedCategory, foods[i].categoryCd)
      )
        continue;
      if (parseInt(foods[i].price) <= remain[4]) tempFoods.push(foods[i]);
      if (
        parseInt(foods[i].calorie) >= remain[0] + NUTR_ERROR_RANGE.calorie[0] &&
        parseInt(foods[i].calorie) <= remain[0] + NUTR_ERROR_RANGE.calorie[1] &&
        parseInt(foods[i].carb) >= remain[1] + NUTR_ERROR_RANGE.carb[0] &&
        parseInt(foods[i].carb) <= remain[1] + NUTR_ERROR_RANGE.carb[1] &&
        parseInt(foods[i].protein) >= remain[2] + NUTR_ERROR_RANGE.protein[0] &&
        parseInt(foods[i].protein) <= remain[2] + NUTR_ERROR_RANGE.protein[1] &&
        parseInt(foods[i].fat) >= remain[3] + NUTR_ERROR_RANGE.fat[0] &&
        parseInt(foods[i].fat) <= remain[3] + NUTR_ERROR_RANGE.fat[1] &&
        parseInt(foods[i].price) <= remain[4]
      )
        availableFoods.push(foods[i]);
    }
    // 오차범위 내 식품 없을 때 영양오차 가장 적은 식품 하나만 가져오기
    // => 단백질 1순위 / 탄수화물, 지방 2순위
    // => 단백질에 가점 2포인트 줘서 errScore계산
    if (availableFoods.length === 0) {
      const foodErrorArr = tempFoods.map(food => {
        return {
          food,
          err: [
            Math.abs(parseInt(food.calorie) - remain[0]),
            Math.abs(parseInt(food.carb) - remain[1]),
            Math.abs(parseInt(food.protein) - remain[2]),
            Math.abs(parseInt(food.fat) - remain[3]),
          ],
          errScore:
            Math.abs(parseInt(food.calorie) - remain[0]) / 6 +
            Math.abs(parseInt(food.carb) - remain[1]) +
            Math.abs(parseInt(food.protein) - remain[2]) * 2 +
            Math.abs(parseInt(food.fat) - remain[3]),
        };
      });
      minErrScore = Math.min(...foodErrorArr.map(food => food.errScore));
      for (let i = 0; i < foodErrorArr.length; i++) {
        if (foodErrorArr[i].errScore === minErrScore) {
          err = [...foodErrorArr[i].err];
          availableFoods.push(foodErrorArr[i].food);
          break;
        }
      }
    }
  }

  shuffle(availableFoods);
  return availableFoods;
};

const shuffle = (arr: any) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const getRandomFood = (availableFoods: IProductsData) => {
  const randomIdx = Math.floor(Math.random() * availableFoods.length);
  return availableFoods[randomIdx];
};

const getRandomMenu = (menu: Array<IProductsData>) => {
  const randomIdx = Math.floor(Math.random() * menu.length);
  return menu[randomIdx];
};

const getErrorMinMenu = (
  menuWithErr: Array<{
    menu: IProductsData;
    isInErrRange: boolean;
    err: number[];
    errScore: number;
  }>,
) => {
  const minError = Math.min(...menuWithErr.map(m => m.errScore ?? 0));
  for (let i = 0; i < menuWithErr.length; i++) {
    if (menuWithErr[i].errScore === minError) return menuWithErr[i].menu;
  }
};

const printValidMenuWithErr = (
  validMenu: Array<{
    menu: IProductsData;
    isInErrRange: boolean;
    err: number[];
    errScore: number;
  }>,
) => {
  // print validMenu
  for (let i = 0; i < validMenu.length; i++) {
    console.log(
      getSum(validMenu[i].menu),
      ' | ',
      getCategoryNum(validMenu[i].menu),
      ' | isInErrRange : ',
      validMenu[i].isInErrRange,
      ' | err : ',
      validMenu[i].err,
      ' | errScore : ',
      validMenu[i].errScore,
    );
  }
};

const printMenu = (menu: IProductsData) => {
  console.log('-------------------------------------');
  for (let i = 0; i < menu.length; i++) {
    console.log(
      `${i + 1} : ${menu[i].productNm} | ${menu[i].calorie}kcal | ${
        menu[i].carb
      }g | ${menu[i].protein}g | ${menu[i].fat}g | ${menu[i].price}원`,
    );
  }
  console.log('합계 : ', getSum(menu));
  console.log('-------------------------------------');
};

// 이미 들어가있던 식품들 제외
const excludeInitialMenu = (
  initialMenu: IProductsData,
  recommendedFoods: IProductsData,
) => {
  const filteredRecommendedFoods = recommendedFoods.filter(
    food => !initialMenu.some(iMenu => iMenu.productNo === food.productNo),
  );
  console.log('--------------- ⬇️ filteredRecommendedFoods ⬇️ ---------------');
  printMenu(filteredRecommendedFoods);
  return filteredRecommendedFoods;
};

const convertMenuToMenuWithErrObj = (menu: IProductsData, target: number[]) => {
  const sum = getSum(menu);
  let err = [];
  let isInErrRange = true;
  for (let i = 0; i < 4; i++) {
    err[i] = Math.abs(sum[i] - target[i]);
  }
  let errScore = err[1] + err[2] * 2 + err[3];
  if (
    sum[0] - target[0] < NUTR_ERROR_RANGE.calorie[0] ||
    sum[0] - target[0] > NUTR_ERROR_RANGE.calorie[1] ||
    sum[1] - target[1] < NUTR_ERROR_RANGE.carb[0] ||
    sum[1] - target[1] > NUTR_ERROR_RANGE.carb[1] ||
    sum[2] - target[2] < NUTR_ERROR_RANGE.protein[0] ||
    sum[2] - target[2] > NUTR_ERROR_RANGE.protein[1] ||
    sum[3] - target[3] < NUTR_ERROR_RANGE.fat[0] ||
    sum[3] - target[3] > NUTR_ERROR_RANGE.fat[1]
  )
    isInErrRange = false;

  return {menu, isInErrRange, err, errScore};
};

interface IInitialize {
  initialMenu: Array<IProductData>;
  baseLine: IBaseLine;
  priceTarget: number[];
  totalFoodList: Array<IProductData>;
}

const initialize = ({
  initialMenu,
  baseLine,
  priceTarget,
  totalFoodList,
}: IInitialize) => {
  const currentMenu = [...initialMenu];

  // 0. 현재 목표영양 중 남은 영양 계산, 선택한 카테고리 확인 == initial상태설정
  const initialSum = getSum(initialMenu);
  const target = [
    parseInt(baseLine.calorie),
    parseInt(baseLine.carb),
    parseInt(baseLine.protein),
    parseInt(baseLine.fat),
    priceTarget[1],
  ];
  const initialRemain = getRemain(target, initialSum);

  // 1. 카테고리별 식품 몇 개 추천할 것인지 설정
  //    0-1. 400이하: 1~2개 | 400~800 : 2~3개 | 800~1200 : 3~4개 | 1200이상 : 4~5개
  const targetNumArr = [
    Math.floor(initialRemain[0] / 400) + 1,
    Math.floor(initialRemain[0] / 400) + 2,
  ];

  const availableFoods = [...totalFoodList];

  return {
    target,
    targetNumArr,
    currentMenu,
    availableFoods,
  };
};

interface IAutoMenu {
  totalFoodList: Array<IProductData>;
  initialMenu: Array<IProductData>;
  baseLine: IBaseLine | undefined;
  selectedCategoryIdx: number[];
  priceTarget: number[];
}
export const makeAutoMenu2 = ({
  totalFoodList,
  initialMenu,
  baseLine,
  selectedCategoryIdx,
  priceTarget,
}: IAutoMenu): Promise<{
  sum: number[];
  recommendedFoods: IProductsData;
}> => {
  return new Promise((resolve, reject) => {
    try {
      if (!baseLine || !initialMenu || !totalFoodList)
        return reject(new Error('앱을 다시 실행해 주세요'));
      // (도시락 닭가슴살 샐러드 영양간식 과자 음료)
      // 식품 칼로리 최대+최소 = 457 kcal | 탄수화물 최대+최소 = 77 g | 단백질 최대+최소 = 41 g | 지방 최대+최소 = 19 g

      // initialize
      let {target, targetNumArr, currentMenu, availableFoods} = initialize({
        initialMenu,
        baseLine,
        priceTarget,
        totalFoodList,
      });
      if (availableFoods.length === 0) return reject('no availableFoods!');

      const TRY_NUM = 20;
      // 20개 메뉴 뽑기
      // errorRange 내의 메뉴가 있다면 랜덤 선택
      // 없으면 error 최소인 메뉴 선택

      let validMenu = [];
      let NO_FOOD_AVAILABLE = false;
      for (let i = 0; i < TRY_NUM; i++) {
        // 추천할 식품 개수 정하기
        shuffle(targetNumArr);
        const targetNum = targetNumArr[0];

        for (let currentNum = 0; currentNum < targetNum; currentNum++) {
          availableFoods = getAvailableFoods({
            foods: availableFoods,
            currentMenu,
            target,
            selectedCategoryIdx,
            targetNum, // 추천받을 식품 수
            currentNum, // 현재 추가되어있는 식품 수
          });
          if (availableFoods.length === 0) {
            NO_FOOD_AVAILABLE = true;
            break;
          }
          currentMenu.push(getRandomFood(availableFoods));
        }
        if (NO_FOOD_AVAILABLE) {
          NO_FOOD_AVAILABLE = false;
          continue;
        }

        validMenu.push(convertMenuToMenuWithErrObj(currentMenu, target));
        currentMenu = [...initialMenu];
        availableFoods = [...totalFoodList];
      }

      if (validMenu.length === 0) return reject('no validMenu!');

      // errRange 내 vs 외 메뉴 구분
      let menuInErrRange = [];
      let menuExceedErrRange = [];
      for (let i = 0; i < validMenu.length; i++) {
        if (validMenu[i].isInErrRange) menuInErrRange.push(validMenu[i]);
        else menuExceedErrRange.push(validMenu[i]);
      }
      console.log('--------------- ⬇️ menuInErrRange ⬇️ ---------------');
      printValidMenuWithErr(menuInErrRange);
      console.log('--------------- ⬇️ menuExceedErrRange ⬇️ ---------------');
      printValidMenuWithErr(menuExceedErrRange);
      console.log('------------------------------------------------------');

      // 오차범위 내 메뉴 있으면 그 중 하나 랜덤 선택
      if (menuInErrRange.length > 0) {
        const recommendedFoods = getRandomMenu(menuInErrRange.map(m => m.menu));
        console.log('오차범위 내 메뉴 있음');
        printMenu(recommendedFoods);
        const filteredRecommendedFoods = excludeInitialMenu(
          initialMenu,
          recommendedFoods,
        );
        return resolve({
          recommendedFoods: filteredRecommendedFoods,
          sum: getSum(recommendedFoods),
        });
      }

      // 오차범위 내 식품 없으면 오차점수 최소인 메뉴 선택
      console.log('오차범위 내 메뉴 없음');
      const recommendedFoods = getErrorMinMenu(menuExceedErrRange);
      if (!recommendedFoods) return reject('no recommendedFoods!');
      printMenu(recommendedFoods);
      const filteredRecommendedFoods = excludeInitialMenu(
        initialMenu,
        recommendedFoods,
      );
      return resolve({
        recommendedFoods: filteredRecommendedFoods,
        sum: getSum(recommendedFoods),
      });
    } catch (error) {
      return reject(error);
    }
  });
};
