import {IBaseLineData} from '../api/types/baseLine';
import {IProductData} from '../api/types/product';
import {NUTR_ERROR_RANGE, SERVICE_PRICE_PER_PRODUCT} from '../constants';
import {IFoodGroupForAutoMenu} from './dataTransform';

const TRY_NUM = 50;

const shuffle = (arr: any) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const removeUnselectedCategory = ({
  foodGroupForAutoMenu,
  selectedCategoryIdxArr,
}: {
  foodGroupForAutoMenu: IFoodGroupForAutoMenu;
  selectedCategoryIdxArr: number[];
}) => {
  const isLunchBoxSelected = selectedCategoryIdxArr.includes(1);
  const isChickenSelected = selectedCategoryIdxArr.includes(2);
  const isSaladSelected = selectedCategoryIdxArr.includes(3);
  const isSnackSelected = selectedCategoryIdxArr.includes(4);
  const isChipSelected = selectedCategoryIdxArr.includes(5);
  const isDrinkSelected = selectedCategoryIdxArr.includes(6);

  const newFoodGroupForAutoMenu = {...foodGroupForAutoMenu};
  Object.keys(newFoodGroupForAutoMenu).forEach(key => {
    Object.keys(newFoodGroupForAutoMenu[key]).forEach(category => {
      if (
        (category === 'lunchBox' && !isLunchBoxSelected) ||
        (category === 'chicken' && !isChickenSelected) ||
        (category === 'salad' && !isSaladSelected) ||
        (category === 'snack' && !isSnackSelected) ||
        (category === 'chip' && !isChipSelected) ||
        (category === 'drink' && !isDrinkSelected)
      ) {
        newFoodGroupForAutoMenu[key][category] = [];
      }
    });
  });
  return newFoodGroupForAutoMenu;
};

const sumUpNutr = (menu: IProductData[]) => {
  if (menu.length === 0) {
    return {calorie: 0, carb: 0, protein: 0, fat: 0};
  }
  const nutr = menu.reduce(
    (acc, food) => {
      acc.calorie += Number(food.calorie);
      acc.carb += Number(food.carb);
      acc.protein += Number(food.protein);
      ``;
      acc.fat += Number(food.fat);
      return acc;
    },
    {calorie: 0, carb: 0, protein: 0, fat: 0},
  );
  return nutr;
};

const sumUpPrice = (menu: IProductData[]) => {
  return menu.reduce((acc, food) => acc + Number(food.price), 0);
};

const getRemainNutr = ({
  nutr,
  baseLine,
}: {
  nutr: {calorie: number; carb: number; protein: number; fat: number};
  baseLine: IBaseLineData;
}) => {
  return {
    calorie: Number(baseLine.calorie) - nutr.calorie,
    carb: Number(baseLine.carb) - nutr.carb,
    protein: Number(baseLine.protein) - nutr.protein,
    fat: Number(baseLine.fat) - nutr.fat,
  };
};

const getRemainNutrRatio = ({
  remainNutr,
}: {
  remainNutr: {calorie: number; carb: number; protein: number; fat: number};
}) => {
  return {
    carb: Math.round(((remainNutr.carb * 4) / remainNutr.calorie) * 100),
    protein: Math.round(((remainNutr.protein * 4) / remainNutr.calorie) * 100),
    fat: Math.round(((remainNutr.fat * 9) / remainNutr.calorie) * 100),
  };
};

const isFoodValid = ({
  food,
  remainNutr,
  remainPrice,
  currentMenu,
  isFirstFood,
  isLastFood,
  wantedPlatform,
}: {
  food: IProductData;
  remainNutr: {calorie: number; carb: number; protein: number; fat: number};
  remainPrice: number;
  currentMenu: IProductData[];
  isFirstFood: boolean;
  isLastFood: boolean;
  wantedPlatform: string;
}) => {
  if (isFirstFood && wantedPlatform !== '') {
    // 원하는 식품사 있는 경우 추천 첫 식품에 적용
    if (
      parseInt(food.calorie) <=
        remainNutr.calorie + NUTR_ERROR_RANGE.calorie[1] &&
      parseInt(food.carb) <= remainNutr.carb + NUTR_ERROR_RANGE.carb[1] &&
      parseInt(food.protein) <=
        remainNutr.protein + NUTR_ERROR_RANGE.protein[1] &&
      parseInt(food.fat) <= remainNutr.fat + NUTR_ERROR_RANGE.fat[1] &&
      parseInt(food.price) + SERVICE_PRICE_PER_PRODUCT <= remainPrice &&
      !currentMenu.some(f => f.productNo === food.productNo) &&
      food.platformNm === wantedPlatform
    )
      return true;
  } else if (!isLastFood) {
    // 마지막식품 아닐때
    if (
      parseInt(food.calorie) <=
        remainNutr.calorie + NUTR_ERROR_RANGE.calorie[1] &&
      parseInt(food.carb) <= remainNutr.carb + NUTR_ERROR_RANGE.carb[1] &&
      parseInt(food.protein) <=
        remainNutr.protein + NUTR_ERROR_RANGE.protein[1] &&
      parseInt(food.fat) <= remainNutr.fat + NUTR_ERROR_RANGE.fat[1] &&
      parseInt(food.price) + SERVICE_PRICE_PER_PRODUCT <= remainPrice &&
      !currentMenu.some(f => f.productNo === food.productNo)
    )
      return true;
  } else {
    // 마지막식품
    if (
      parseInt(food.calorie) >=
        remainNutr.calorie + NUTR_ERROR_RANGE.calorie[0] &&
      parseInt(food.calorie) <=
        remainNutr.calorie + NUTR_ERROR_RANGE.calorie[1] &&
      parseInt(food.carb) >= remainNutr.carb + NUTR_ERROR_RANGE.carb[0] &&
      parseInt(food.carb) <= remainNutr.carb + NUTR_ERROR_RANGE.carb[1] &&
      parseInt(food.protein) >=
        remainNutr.protein + NUTR_ERROR_RANGE.protein[0] &&
      parseInt(food.protein) <=
        remainNutr.protein + NUTR_ERROR_RANGE.protein[1] &&
      parseInt(food.fat) >= remainNutr.fat + NUTR_ERROR_RANGE.fat[0] &&
      parseInt(food.fat) <= remainNutr.fat + NUTR_ERROR_RANGE.fat[1] &&
      parseInt(food.price) + SERVICE_PRICE_PER_PRODUCT <= remainPrice &&
      !currentMenu.some(f => f.productNo === food.productNo)
    )
      return true;
  }
};

const getErrScore = ({
  remainNutr,
  food,
}: {
  remainNutr: {calorie: number; carb: number; protein: number; fat: number};
  food: IProductData;
}) => {
  const carbErr = Math.abs(parseInt(food.carb) - remainNutr.carb);
  const proteinErr = Math.abs(parseInt(food.protein) - remainNutr.protein);
  const fatErr = Math.abs(parseInt(food.fat) - remainNutr.fat);
  return carbErr + proteinErr * 2 + fatErr;
};

const getFood = ({
  foodGroup,
  remainNutr,
  remainPrice,
  currentMenu,
  isFirstFood,
  isLastFood,
  wantedPlatform,
}: {
  foodGroup: IFoodGroupForAutoMenu;
  remainNutr: {calorie: number; carb: number; protein: number; fat: number};
  remainPrice: number;
  currentMenu: IProductData[];
  isFirstFood: boolean;
  isLastFood: boolean;
  wantedPlatform: string;
}) => {
  let errScore = 0;
  const ratio = getRemainNutrRatio({remainNutr});
  let neededGroup =
    ratio.carb > 50
      ? 'highCarb'
      : ratio.protein > 50
        ? 'highProtein'
        : ratio.fat > 50
          ? 'highFat'
          : 'normal';

  let availableFoodsInCategory: IProductData[] = [];
  for (const category in foodGroup[neededGroup]) {
    foodGroup[neededGroup][category].forEach(food => {
      isFoodValid({
        food,
        remainNutr,
        remainPrice,
        currentMenu,
        isFirstFood,
        isLastFood,
        wantedPlatform,
      }) && availableFoodsInCategory.push(food);
    });
  }
  if (availableFoodsInCategory.length === 0) {
    for (const category in foodGroup['total']) {
      foodGroup['total'][category].forEach(food => {
        isFoodValid({
          food,
          remainNutr,
          remainPrice,
          currentMenu,
          isFirstFood,
          isLastFood,
          wantedPlatform,
        }) && availableFoodsInCategory.push(food);
      });
    }
  }

  if (availableFoodsInCategory.length !== 0) {
    // available shuffle 후에 전체 중 하나 뽑거나
    shuffle(availableFoodsInCategory);
    return {food: availableFoodsInCategory[0], errScore};
  }

  // 범위 내 식품이 없는 경우
  let foodlistWithErrScore: {food: IProductData; errScore: number}[] = [];
  for (const category in foodGroup['total']) {
    foodGroup['total'][category].forEach(food => {
      if (!currentMenu.some(f => f.productNo === food.productNo)) {
        const errScore = getErrScore({remainNutr, food});
        foodlistWithErrScore.push({food, errScore});
      }
    });
  }

  // errorScore 가장 작은 식품 선택
  foodlistWithErrScore.sort((a, b) => a.errScore - b.errScore);
  return {
    food: foodlistWithErrScore[0].food,
    errScore: foodlistWithErrScore[0].errScore,
  };
};

const logResult = (
  menuWithErrScore: {menu: IProductData[]; errScore: number}[],
) => {
  const totalTryMenu = menuWithErrScore.map(v => ({
    menu: v.menu.map(food => food.productNm),
    errScore: v.errScore,
    nutr: sumUpNutr(v.menu),
  }));

  console.log(`------- 전체 시도 ${TRY_NUM} 번 -------`);
  totalTryMenu.forEach((v, i) => {
    console.log(
      `menu ${String(i + 1).padEnd(5)} | errScore: ${String(v.errScore).padEnd(8)} | 칼로리: ${String(v.nutr.calorie).padEnd(3)} 탄수화물: ${String(v.nutr.carb).padEnd(3)} 단백질: ${String(v.nutr.protein).padEnd(3)} 지방: ${String(v.nutr.fat).padEnd(0)}`,
    );
  });
};

const initialize = ({
  foodGroupForAutoMenu,
  initialMenu,
  baseLine,
  selectedCategoryIdx,
  priceTarget,
}: {
  foodGroupForAutoMenu: IFoodGroupForAutoMenu;
  initialMenu: IProductData[];
  baseLine: IBaseLineData;
  selectedCategoryIdx: number[];
  priceTarget: number[];
}) => {
  // 0. initialize
  const foodGroup = removeUnselectedCategory({
    foodGroupForAutoMenu,
    selectedCategoryIdxArr: selectedCategoryIdx,
  });
  const initRemainNutr = getRemainNutr({
    nutr: sumUpNutr(initialMenu),
    baseLine,
  });
  const initRemainPrice = priceTarget[1] - sumUpPrice(initialMenu);
  const menuWithErrScore = [] as {menu: IProductData[]; errScore: number}[];

  return {
    foodGroup,
    initRemainNutr,
    initRemainPrice,
    menuWithErrScore,
  };
};

const excludeInitialMenu = (
  initialMenu: IProductData[],
  recommendedFoods: IProductData[],
) => {
  const filteredRecommendedFoods = recommendedFoods.filter(
    food => !initialMenu.some(iMenu => iMenu.productNo === food.productNo),
  );
  return filteredRecommendedFoods;
};

interface IMakeAutoMenu {
  medianCalorie: number;
  foodGroupForAutoMenu: IFoodGroupForAutoMenu;
  initialMenu: Array<IProductData>;
  baseLine: IBaseLineData;
  selectedCategoryIdx?: number[];
  priceTarget: number[];
  wantedPlatform: string;
  menuNum: number;
}
export const makeAutoMenu3 = ({
  medianCalorie,
  foodGroupForAutoMenu,
  initialMenu = [],
  baseLine,
  selectedCategoryIdx = [1, 2, 3, 4, 5, 6],
  priceTarget,
  wantedPlatform,
  menuNum,
}: IMakeAutoMenu): Promise<{recommendedMenu: IProductData[][]}> => {
  return new Promise((resolve, reject) => {
    try {
      const {foodGroup, initRemainNutr, initRemainPrice, menuWithErrScore} =
        initialize({
          foodGroupForAutoMenu,
          initialMenu,
          baseLine,
          selectedCategoryIdx,
          priceTarget,
        });

      if (initRemainNutr.calorie < NUTR_ERROR_RANGE.calorie[0])
        return reject('끼니 칼로리가 이미 초과되었어요');

      // TRY_NUM 만큼 끼니 만들 것
      // 3. tryNum 만큼 반복
      for (let i = 0; i < TRY_NUM; i++) {
        let isLastFood = false;
        let oneMenuCompleted = false;
        let remainNutr = {...initRemainNutr};
        let remainPrice = initRemainPrice;
        let menu: IProductData[] = [...initialMenu];
        let idx = 0;
        while (!oneMenuCompleted) {
          if (remainNutr.calorie < medianCalorie + NUTR_ERROR_RANGE.calorie[1])
            isLastFood = true;
          const food = getFood({
            foodGroup,
            remainNutr,
            remainPrice,
            currentMenu: menu,
            isFirstFood: idx === 0,
            isLastFood,
            wantedPlatform,
          });
          menu.push(food.food);
          remainNutr.calorie -= parseInt(food.food.calorie);
          remainNutr.carb -= parseInt(food.food.carb);
          remainNutr.protein -= parseInt(food.food.protein);
          remainNutr.fat -= parseInt(food.food.fat);
          remainPrice -= parseInt(food.food.price);
          if (isLastFood) {
            menuWithErrScore.push({menu, errScore: food.errScore});
            isLastFood && (oneMenuCompleted = true);
          }
          idx += 1;
        }
      }
      // try_num 반복 중에 errScore 가장 낮은 끼니 menuNum 만큼 선택
      menuWithErrScore.sort((a, b) => a.errScore - b.errScore);
      // logResult(menuWithErrScore);

      // initialMenu 제외
      const recommendedMenu = menuWithErrScore
        .slice(0, menuNum)
        .map(v => excludeInitialMenu(initialMenu, v.menu));

      return resolve({recommendedMenu});
    } catch (error) {
      return reject(error);
    }
  });

  // 1. remainNutr ratio 확인
  // 2. getFood
  //   2-1-1. 비율에 맞는 식품 그룹에서 식품 랜덤선택
  //   2-1-2. 해당 식품그룹 없으면 total 그룹에서 랜덤선택
  //   2-2. 마지막 식품인 경우 errorScore 최소로 하는 식품 선택 + errorScore 저장
  // 3. tryNum 만큼 반복
  // 4-1. 해당 개수 끼니 중 errorRange 내 식품 랜덤 선택
  // 4-2. errorRange 내 식품 없으면 errorScore 최소 끼니 선택
};
