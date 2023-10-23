export interface IFilterParams {
  categoryParam: string;
  nutritionParam: {
    calorieParam: number[];
    carbParam: number[];
    proteinParam: number[];
    fatParam: number[];
  };
  priceParam: number[];
}

export interface IListProductParams {
  dietNo: string;
  searchText?: string;
  categoryCd?: string;
  sort?: string;
  filter?: IFilterParams;
}

export interface ICreateProductAutoParams {
  dietNo: string;
  categoryText?: string;
  priceText?: string;
}

export interface IProductData {
  calorie: string;
  carb: string;
  categoryCd: string;
  categoryNm: string;
  cholesterol: string;
  distributerBizNo: string;
  distributerNm: string;
  fat: string;
  fiber: string;
  freeShippingPrice: string;
  freeShippingYn: string;
  mainAttId: string;
  mainAttUrl: string;
  manufacturerBizNo: string;
  manufacturerNm: string;
  minQty: string;
  platformNm: string;
  price: string;
  priceCalorieCompare: string;
  priceProteinCompare: string;
  productChoiceYn: string;
  productNm: string;
  productNo: string;
  protein: string;
  saturatedFat: string;
  servingSize: string;
  shippingPrice: string;
  sodium: string;
  subAttId: string;
  subAttUrl: string;
  subCategoryCd: string;
  subCategoryNm: string;
  sugar: string;
  transFat: string;
  link1: string;
  link2: string;
}

export type IProductsData = IProductData[];

export interface IProductDetailData {
  imageLink: string;
  productNo: string;
  seq: string;
}
