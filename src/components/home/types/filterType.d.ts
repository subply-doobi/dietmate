export interface FILTER_PARAMS_TYPE {
  categoryParam: string;
  nutritionParam: {
    calorieParam: [number, number];
    carbParam: [number, number];
    proteinParam: [number, number];
    fatParam: [number, number];
  };
  priceParam: [number, number];
  filterHeaderText: string;
}

export interface FILTER_TYPE {
  filterIndex: number;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterParams: React.Dispatch<React.SetStateAction<any>>;
  filterParams: FILTER_PARAMS_TYPE;
  setRemainNutrProductData: React.Dispatch<React.SetStateAction<any>>;
}

export interface FILTER_MODAL_TYPE {
  filterIndex: number;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterParams: React.Dispatch<React.SetStateAction<any>>;
  filterParams: FILTER_PARAMS_TYPE;
  setRemainNutrProductData: React.Dispatch<React.SetStateAction<any>>;
}

export interface FLATLIST_TYPE {
  translateY: number;
  remainNutrProductData: any;
  setRemainNutrProductData: React.Dispatch<any>;
  productData: any;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  refetchProduct: any;
  sortImageToggle: number;
  setSortParam: React.Dispatch<React.SetStateAction<string>>;
  sortParam: string;
  setFilterModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  filterParams: FILTER_PARAMS_TYPE;
  setFilterIndex: any;
  categoryName: string;
}
