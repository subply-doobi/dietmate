import {IBaseLine} from '../query/types/baseLine';
import {IProductData, IProductsData} from '../query/types/product';

const getRandomIndexArr = (length: number) => {
  let resultArr = Array.from({length}, (_, i) => i);
  let temp;
  let randomNum;

  //값을 서로 섞기
  for (let i = 0; i < resultArr.length; i++) {
    randomNum = Math.floor(Math.random() * length); //난수발생
    temp = resultArr[i];
    resultArr[i] = resultArr[randomNum];
    resultArr[randomNum] = temp;
  }

  return resultArr;
};

const makeProductNoList = (arr: IProductData[]) => {
  let productNoArr: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    productNoArr.push(arr[i].productNo);
  }
  return productNoArr;
};

const checkIsContain = (arr: string[], productNo: string) => {
  let isContain = false;
  if (arr.includes(productNo)) isContain = true;
  return isContain;
};

/**
 *
 * @param arr 중앙값 구할 배열
 * @param unitNutr 중앙값 구할 영양소 or 열량 'calorie' | 'carb' | 'protein' | 'fat'
 * @returns
 */
const getUnitNutrMedian = (
  arr: IProductData[],
  unitNutr: 'calorie' | 'carb' | 'protein' | 'fat',
) => {
  let valueArr = arr.map(food => parseInt(food[unitNutr]));
  valueArr.sort((a, b) => a - b);
  let midIdx = Math.floor(valueArr.length / 2);
  return valueArr[midIdx];
};

/**
 *
 * @param arr 전체 식품 배열
 * @returns 카테고리별로 나눠진 식품 배열
 */
const sortFoodsByCategory = (
  arr: IProductData[],
  selectedCategory: number[],
  initialRemainNutr: number[],
  initialRemainPrice: number,
) => {
  console.log('initialRemainNutr: ', initialRemainNutr);
  console.log('initialRemainPrice: ', initialRemainPrice);
  let sortedCategory: IProductData[][] = [];

  // 0, 1, 2, 3, 4, 5
  const categoryCd = ['CG001', 'CG002', 'CG003', 'CG004', 'CG005', 'CG006'];
  for (let i = 0; i < selectedCategory.length; i++) {
    let sortedFoods = [];
    for (let j = 0; j < arr.length; j++) {
      if (
        arr[j].categoryCd === categoryCd[selectedCategory[i]] &&
        parseInt(arr[j].calorie) <= initialRemainNutr[0] &&
        parseInt(arr[j].carb) <= initialRemainNutr[1] &&
        parseInt(arr[j].protein) <= initialRemainNutr[2] &&
        parseInt(arr[j].fat) <= initialRemainNutr[3] &&
        parseInt(arr[j].price) <= initialRemainPrice
      )
        sortedFoods.push(arr[j]);
    }
    sortedCategory.push(sortedFoods);
  }
  return sortedCategory;
};

/**
 *
 * @param arr 식품 가져올 배열
 * @param recommendedFoods 현재 담겨있는 식품 배열
 * @returns 랜덤으로 추천되는 식품
 */
const getRandomFood = (
  arr: IProductData[],
  recommendedFoods: IProductData[],
) => {
  const randomIdxArr = getRandomIndexArr(arr.length);
  for (let i = 0; i < randomIdxArr.length; i++) {
    if (
      !checkIsContain(
        makeProductNoList(recommendedFoods),
        arr[randomIdxArr[i]].productNo,
      )
    ) {
      return arr[randomIdxArr[i]];
    }
  }
  return undefined;
};

/**
 * @param sortedFoods 카테고리별로 나눠진 식품 배열
 * @param selectedCategory 사용자가 선택한 식품 카테고리 배열
 * @param remainNutr 남은 영양소 배열
 * @param remainPrice 남은 가격
 * @returns 추천되는 식품이 있는지, 추천되는 식품이 있다면 추천되는 식품의 카테고리 인덱스, 추천되는 식품
 */
const getFoodByRemain = (
  sortedFoods: IProductData[][],
  selectedCategory: number[],
  remainNutr: {
    calorie: number[];
    carb: number[];
    protein: number[];
    fat: number[];
  },
  remainPrice: number,
  recommendedFoods: IProductData[],
) => {
  const recommendedFoodsPN = recommendedFoods.map(food => food.productNo);
  let recommendedCategoryIdx = 0;
  let availableFoods: IProductData[] = [];
  for (let i = 0; i < sortedFoods.length; i++) {
    let foods = sortedFoods[i];
    for (let j = 0; j < foods.length; j++) {
      if (
        parseInt(foods[j].calorie) >= remainNutr.calorie[0] &&
        parseInt(foods[j].calorie) <= remainNutr.calorie[1] &&
        // parseInt(food.carb) >= remainNutr.carb[0] &&
        parseInt(foods[j].carb) <= remainNutr.carb[1] &&
        // parseInt(food.protein) >= remainNutr.protein[0] &&
        parseInt(foods[j].protein) <= remainNutr.protein[1] &&
        // parseInt(food.fat) >= remainNutr.fat[0] &&
        parseInt(foods[j].fat) <= remainNutr.fat[1] &&
        parseInt(foods[j].price) <= remainPrice &&
        recommendedFoodsPN.includes(foods[j].productNo) === false
      ) {
        availableFoods.push(foods[j]);
      }
    }
  }
  console.log('availableFoods: ', availableFoods.length);
  if (availableFoods.length === 0) {
    return {isRecommended: false};
  }

  let randomIdx = Math.floor(Math.random() * availableFoods.length);
  let recommendedFood = availableFoods[randomIdx];
  recommendedCategoryIdx =
    recommendedFood.categoryCd === 'CG001'
      ? 0
      : recommendedFood.categoryCd === 'CG002'
      ? 1
      : recommendedFood.categoryCd === 'CG003'
      ? 2
      : recommendedFood.categoryCd === 'CG004'
      ? 3
      : recommendedFood.categoryCd === 'CG005'
      ? 4
      : 5;

  // console.log('recommendedFood: ', recommendedFood.productNm);
  return {isRecommended: true, recommendedCategoryIdx, recommendedFood};
};

const sumNutr = (arr: IProductData[]) => {
  let sum = [0, 0, 0, 0];
  for (let i = 0; i < arr.length; i++) {
    sum[0] += parseInt(arr[i].calorie);
    sum[1] += parseInt(arr[i].carb);
    sum[2] += parseInt(arr[i].protein);
    sum[3] += parseInt(arr[i].fat);
  }
  return sum;
};

const sumPrice = (arr: IProductData[]) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += parseInt(arr[i].price);
  }
  return sum;
};

interface IRecommendUnit {
  sortedFoods: IProductData[][];
  selectedCategory: number[];
  calRange: number[];
  carbRange: number[];
  proteinRange: number[];
  fatRange: number[];
  nutrTarget: number[];
  priceTarget: number;
  unitNo: number;
  i: number;
  recommendedFoods: IProductData[];
  lastUnitFoodNo: number;
}
const recommendUnit = ({
  sortedFoods,
  selectedCategory,
  calRange,
  carbRange,
  proteinRange,
  fatRange,
  nutrTarget,
  priceTarget,
  unitNo,
  i,
  recommendedFoods,
  lastUnitFoodNo,
}: IRecommendUnit) => {
  let resultFoods = [...recommendedFoods];
  let isUnitComplete = false;
  let isFirstFoodInvalid = false;
  let try1 = 0;
  while (!isUnitComplete) {
    console.log('recommendUnit try: ', try1);
    try1 += 1;
    if (try1 > 100) {
      console.log('recommend unit try 초과: ', try1);
      return {isUnitComplete, resultFoods};
    }

    // randomIdx 배열 만들기
    const randomIdxArr = getRandomIndexArr(sortedFoods.length);
    let firstFood: IProductData | undefined;
    for (let i = 0; i < randomIdxArr.length; i++) {
      firstFood = getRandomFood(sortedFoods[i], resultFoods);
      if (firstFood !== undefined) {
        break;
      }
    }
    if (firstFood === undefined)
      return {isUnitComplete, resultFoods, isFirstFoodInvalid: true};

    const nextUnitFoodNo =
      unitNo === 1 || i === unitNo - 1
        ? 0
        : (unitNo - i - 2) * 2 + lastUnitFoodNo;

    let remainNutr = {
      calorie: [
        calRange[0] + calRange[1] - parseInt(firstFood.calorie) - 30,
        calRange[0] + calRange[1] - parseInt(firstFood.calorie) + 30,
      ],
      carb: [
        nutrTarget[1] - nextUnitFoodNo * carbRange[0] - 7,
        nutrTarget[1] - nextUnitFoodNo * carbRange[0] + 7,
      ],
      protein: [
        nutrTarget[2] - nextUnitFoodNo * proteinRange[0] - 7,
        nutrTarget[2] - nextUnitFoodNo * proteinRange[0] + 7,
      ],
      fat: [
        nutrTarget[3] - nextUnitFoodNo * fatRange[0] - 3,
        nutrTarget[3] - nextUnitFoodNo * fatRange[0] + 3,
      ],
    };
    // 다음 유닛들에서 추가될 상품 갯수 * 상품최저가
    let remainPrice =
      priceTarget - parseInt(firstFood.price) - nextUnitFoodNo * 880;
    if (i === unitNo - 1) {
      const nutrTotal = sumNutr(recommendedFoods);
      remainNutr = {
        calorie: [
          nutrTarget[0] - nutrTotal[0] - parseInt(firstFood.calorie) - 30,
          nutrTarget[0] - nutrTotal[0] - parseInt(firstFood.calorie) + 30,
        ],
        carb: [
          nutrTarget[1] - nutrTotal[1] - parseInt(firstFood.carb) - 7,
          nutrTarget[1] - nutrTotal[1] - parseInt(firstFood.carb) + 7,
        ],
        protein: [
          nutrTarget[2] - nutrTotal[2] - parseInt(firstFood.protein) - 7,
          nutrTarget[2] - nutrTotal[2] - parseInt(firstFood.protein) + 7,
        ],
        fat: [
          nutrTarget[3] - nutrTotal[3] - parseInt(firstFood.fat) - 3,
          nutrTarget[3] - nutrTotal[3] - parseInt(firstFood.fat) + 3,
        ],
      };
      remainPrice =
        priceTarget - sumPrice(recommendedFoods) - parseInt(firstFood.price);
    }

    // console.log(`${i}번째 unit firstFood: ${firstFood.productNm}`);
    let {isRecommended, recommendedCategoryIdx, recommendedFood} =
      getFoodByRemain(
        sortedFoods,
        selectedCategory,
        remainNutr,
        remainPrice,
        recommendedFoods,
      );

    if (
      isRecommended &&
      recommendedFood &&
      recommendedCategoryIdx !== undefined
    ) {
      resultFoods.push(firstFood);
      resultFoods.push(recommendedFood);
      isUnitComplete = true;
    }
  }
  // if (!isUnitComplete) {
  //   console.log(`유닛추천 실패: ${i}번째 unit`);
  //   console.log(`nutrTotal: `, sumNutr(resultFoods));
  // }
  // if (isUnitComplete)
  //   console.log(
  //     `유닛추천 성공: try: ${try1}, ${i}번째 unit, resultLength: ${
  //       resultFoods.length
  //     }, ${sumNutr(resultFoods)}`,
  //   );

  return {isUnitComplete, resultFoods};
};

export const makeAutoMenu = (
  foods: Array<IProductData>,
  dietDetailData: Array<IProductData>,
  baseLine: IBaseLine | undefined,
  selectedCategory: number[],
  priceTarget: number,
): Promise<{
  sumNutr: number[];
  sumPrice: number;
  recommendedFoods: IProductsData;
}> => {
  return new Promise((resolve, reject) => {
    try {
      // nutr Target
      const nutrTarget = baseLine
        ? [
            parseInt(baseLine.calorie), // 1000
            parseInt(baseLine.carb), // 138
            parseInt(baseLine.protein), // 50
            parseInt(baseLine.fat), // 28
          ]
        : [600, 83, 30, 17];

      const initialCategoryNo = [0, 0, 0, 0, 0, 0];
      let recommendedCategoryNo = [0, 0, 0, 0, 0, 0];
      const initialDiet = [...dietDetailData];
      const initialSumNutr = sumNutr(initialDiet);
      const initialRemainNutr = nutrTarget.map((nutr, idx) => {
        return nutr - initialSumNutr[idx];
      });
      const initialRemainPrice = priceTarget - sumPrice(initialDiet);

      let recommendedFoods = [...dietDetailData];
      // console.log('initial recommendedFoods:', recommendedFoods);
      const calRange = [20, 457];
      const carbRange = [0, 77];
      const proteinRange = [1, 41];
      const fatRange = [0, 19];

      const unitNutrMedian = getUnitNutrMedian(foods, 'calorie');
      const unitNo = Math.ceil(nutrTarget[0] / (calRange[0] + calRange[1]));

      const remainder = nutrTarget[0] % (calRange[0] + calRange[1]);
      // console.log('remainder: ', remainder);
      const lastUnitFoodNo =
        remainder <= 20 ? 0 : remainder <= unitNutrMedian ? 1 : 2;

      // ['CG001', 'CG002', 'CG003', 'CG004', 'CG005', 'CG006']
      const sortedFoods = sortFoodsByCategory(
        foods,
        selectedCategory,
        initialRemainNutr,
        initialRemainPrice,
      );

      const isSortedFoodAvailable = sortedFoods.some(category => {
        return category.length > 0;
      });

      if (!isSortedFoodAvailable) reject(new Error('식품 데이터가 부족해요'));

      let isRecommendComplete = false;

      let try1 = 0;
      while (!isRecommendComplete) {
        try1 += 1;
        if (try1 > 100) {
          console.log('전체 try 초과: ', try1);
          throw new Error(`끼니 자동구성에 실패했어요\n다시 시도해주세요`);
        }

        for (let i = 0; i < unitNo; i++) {
          console.log('unitNo: ', unitNo, 'currentUnit: ', i);
          // 추천 유닛 수 만큼 반복해서 식품 2개씩 채우기 (마지막은 lastRecommendNo)
          // 유닛 당 칼로리 목표는 calRange[0] + calRange[1]
          // (마지막은 remainder)
          // 유닛 당 다른 nutr목표는 전체 목표에서 (유닛 x)
          // 남은 식품추가 수 * 각 nutr 최소값 만큼 남기도록 -> 식품들 최소값들 비교해보기

          // 마지막 유닛 아닌경우
          if (i !== unitNo - 1) {
            const {isUnitComplete, resultFoods, isFirstFoodInvalid} =
              recommendUnit({
                sortedFoods,
                selectedCategory,
                calRange,
                carbRange,
                proteinRange,
                fatRange,
                nutrTarget,
                priceTarget,
                unitNo,
                i,
                recommendedFoods,
                lastUnitFoodNo,
              });

            if (isFirstFoodInvalid) reject(new Error('식품 데이터가 부족해요'));

            if (!isUnitComplete) {
              recommendedCategoryNo = [...initialCategoryNo];
              recommendedFoods = [...initialDiet];
              break;
            }
            recommendedFoods = [...resultFoods];
          } else {
            // 마지막 유닛 식품을 1개만 추천해줄 것인지 아닌지
            if (lastUnitFoodNo === 2) {
              const {isUnitComplete, resultFoods, isFirstFoodInvalid} =
                recommendUnit({
                  sortedFoods,
                  selectedCategory,
                  calRange,
                  carbRange,
                  proteinRange,
                  fatRange,
                  nutrTarget,
                  priceTarget,
                  unitNo,
                  i,
                  recommendedFoods,
                  lastUnitFoodNo,
                });
              if (isFirstFoodInvalid)
                reject(new Error('식품 데이터가 부족해요'));
              if (!isUnitComplete) {
                recommendedCategoryNo = [...initialCategoryNo];
                recommendedFoods = [...initialDiet];
                break;
              }
              recommendedFoods = [...resultFoods];
              isRecommendComplete = true;
              console.log(
                `recommendedFoods: complete: try: ${try1}`,
                sumNutr(recommendedFoods),
                recommendedCategoryNo,
                recommendedFoods,
              );
              // make an array with recommendedFoods except initialDiet
              resolve({
                sumNutr: sumNutr(recommendedFoods),
                sumPrice: sumPrice(recommendedFoods),
                recommendedFoods:
                  initialDiet.length !== 0
                    ? recommendedFoods.filter(
                        food => !initialDiet.includes(food),
                      )
                    : recommendedFoods,
              });
            } else if (lastUnitFoodNo === 1) {
              let nutrTotal = sumNutr(recommendedFoods);
              let priceTotal = sumPrice(recommendedFoods);

              let {isRecommended, recommendedCategoryIdx, recommendedFood} =
                getFoodByRemain(
                  sortedFoods,
                  selectedCategory,
                  {
                    calorie: [remainder - 30, remainder + 30],
                    carb: [
                      nutrTarget[1] - nutrTotal[1] - 7,
                      nutrTarget[1] - nutrTotal[1] + 7,
                    ],
                    protein: [
                      nutrTarget[2] - nutrTotal[2] - 7,
                      nutrTarget[2] - nutrTotal[2] + 7,
                    ],
                    fat: [
                      nutrTarget[3] - nutrTotal[3] - 3,
                      nutrTarget[3] - nutrTotal[3] + 3,
                    ],
                  },
                  priceTarget - priceTotal,
                  recommendedFoods,
                );

              if (!isRecommended) {
                // console.log('유닛 추천 실패 (1마지막 1개 식품인 경우)');
                // console.log(`nutrTotal`, nutrTotal);
                recommendedCategoryNo = [...initialCategoryNo];
                recommendedFoods = [...initialDiet];
                break;
              }
              if (
                isRecommended &&
                recommendedFood &&
                recommendedCategoryIdx !== undefined
              ) {
                recommendedFoods.push(recommendedFood);
                recommendedCategoryNo[recommendedCategoryIdx] += 1;
                isRecommendComplete = true;
                // console.log(
                //   `recommendedFoods: complete: try: ${try1}`,
                //   sumNutr(recommendedFoods),
                //   recommendedCategoryNo,
                //   recommendedFoods,
                // );
                resolve({
                  sumNutr: sumNutr(recommendedFoods),
                  sumPrice: sumPrice(recommendedFoods),
                  recommendedFoods:
                    initialDiet.length !== 0
                      ? recommendedFoods.filter(
                          food => !initialDiet.includes(food),
                        )
                      : recommendedFoods,
                });
              }
            } else {
              isRecommendComplete = true;
              // console.log(
              //   `recommendedFoods: complete: try: ${try1}`,
              //   sumNutr(recommendedFoods),
              //   recommendedCategoryNo,
              //   recommendedFoods,
              // );
              resolve({
                sumNutr: sumNutr(recommendedFoods),
                sumPrice: sumPrice(recommendedFoods),
                recommendedFoods:
                  initialDiet.length !== 0
                    ? recommendedFoods.filter(
                        food => !initialDiet.includes(food),
                      )
                    : recommendedFoods,
              });
            }
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
