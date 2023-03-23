import {useMutation, useQueries, useQuery} from '@tanstack/react-query';
import axios from 'axios';

import {queryClient} from '../store';
import {validateToken} from './token';
import {mutationFn, queryFn} from './requestFn';
import {DIET_DETAIL, PRODUCT} from '../keys';
import {IQueryOptions} from '../types/common';

import {
  CREATE_PRODUCT_MARK,
  DELETE_PRODUCT_MARK,
  CREATE_PRODUCT_AUTO,
  LIST_PRODUCT,
  FILTER,
} from './urls';

export const useCreateProductMark = () => {
  const mutation = useMutation({
    mutationFn: (productNo: string) =>
      mutationFn(`${CREATE_PRODUCT_MARK}/${productNo}`, 'put'),
  });
  return mutation;
};

export const useDeleteProductMark = () => {
  const mutation = useMutation({
    mutationFn: (productNo: string) =>
      mutationFn(`${DELETE_PRODUCT_MARK}/${productNo}`, 'delete'),
    onSuccess: data => console.log(data),
  });
  return mutation;
};

// PUT
export const useCreateProductAuto = () => {
  const mutation = useMutation({
    mutationFn: ({
      dietNo,
      categoryText = '',
      priceText = '',
    }: {
      dietNo: string;
      categoryText?: string;
      priceText?: string;
    }) => {
      return mutationFn(
        `${CREATE_PRODUCT_AUTO}/${dietNo}?categoryText=${categoryText}&priceText=${priceText}`,
        'put',
      );
    },
    onSuccess: data => {
      console.log(data);
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL]});
    },
  });
  return mutation;
};
// optional params 어떻게 받을 것인지

// GET //
export const useListProduct = (
  params: {
    dietNo: string;
    searchText?: string;
    categoryCd?: string;
    sort?: string;
    filter?: string;
  },
  options?: IQueryOptions,
) => {
  const dietNo = params?.dietNo ? params.dietNo : '';
  const enabled = options?.enabled ?? true;
  const searchText = params?.searchText ? params?.searchText : '';
  const categoryCd = params?.categoryCd ? params?.categoryCd : '';
  const sort = params?.sort ? params?.sort : '';
  const filter = params?.filter ? params?.filter : '';
  const calorie = filter.filterParams?.nutritionParam?.calorieParam
    ? filter.filterParams?.nutritionParam?.calorieParam
    : '';
  const protein = filter.filterParams?.nutritionParam?.proteinParam
    ? filter.filterParams?.nutritionParam?.proteinParam
    : '';
  const carb = filter.filterParams?.nutritionParam?.carbParam
    ? filter.filterParams?.nutritionParam?.carbParam
    : '';
  const fat = filter.filterParams?.nutritionParam?.fatParam
    ? filter.filterParams?.nutritionParam?.fatParam
    : '';
  const price = filter.filterParams?.priceParam
    ? filter.filterParams?.priceParam
    : '';
  const categoryParam = categoryCd === '' ? '' : categoryCd;
  const calorieParam = calorie ? `Calorie,${calorie[0]},${calorie[1]}|` : '';
  const carbParam = carb ? `Carb,${carb[0]},${carb[1]}|` : '';
  const proteinParam = protein ? `Protein,${protein[0]},${protein[1]}|` : '';
  const priceParam = price ? `Price,${price[0]},${price[1]}|` : '';
  const fatParam = fat ? `Fat,${fat[0]},${fat[1]}|` : '';

  // console.log('product:', priceParam);

  return useQuery({
    queryKey: [PRODUCT],
    queryFn: () =>
      queryFn(
        `${LIST_PRODUCT}/${dietNo}?searchText=${searchText}&categoryCd=${categoryParam}&sort=${sort}&filter=${calorieParam}${carbParam}${proteinParam}${fatParam}${priceParam}`,
      ),
    enabled,
    onSuccess: data => {
      options?.onSuccess && options?.onSuccess();
    },
  });
};

export const useFilterRange = (filterType, options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: ['filterRange', filterType],
    queryFn: () => queryFn(`${FILTER}/${filterType}`),
    onSuccess: data => {},
    enabled,
  });
};
export const useTest = async () => {
  const {isTokenValid, validToken} = await validateToken();
  const requestConfig = {headers: {authorization: `Bearer ${validToken}`}};
  useQueries({
    queries: [
      {
        queryKey: ['a'],
        queryFn: () => axios.get(`${FILTER}/Protein`, requestConfig),
        onError: e => {
          console.log('a Error: ', e);
        },
        suspense: true,
      },
      {
        queryKey: ['b'],
        queryFn: () => axios.get(`${FILTER}/fat`, requestConfig),
        onError: e => {
          console.log('b Error: ', e);
        },
        suspense: true,
      },
    ],
  });
};

const listProductTest = {
  calorie: '232.000',
  carb: '23.000',
  categoryCd: 'CG003',
  categoryNm: '샐러드',
  distributerBizNo: '346-88-00170',
  distributerNm: '㈜에이타워',
  fat: '8.000',
  mainAttId: 'PD202207131320083658528',
  mainAttUrl: '/files/pd/202207/5_t_202207131320084273042.png',
  platformNm: '포켓샐러드',
  price: '6500',
  priceCalorieCompare: '0.0356923',
  priceProteinCompare: '0.0027692',
  productNm: '포켓샐러드 불고기 샐러드',
  productNo: 'PD20220713000000152',
  protein: '18.000',
  subCategoryCd: 'CG003002',
  subCategoryNm: '토핑(단백질)',
};

const dietDetailTest = [
  {
    calorie: '340.000',
    carb: '47.000',
    categoryCd: 'CG001',
    categoryNm: '도시락',
    dietNo: 'DT20230223000000001',
    distributerBizNo: '557-81-00806',
    distributerNm: '㈜미스터네이처',
    fat: '10.000',
    mainAttId: 'PD202207131319226158904',
    mainAttUrl: '/files/pd/202207/13_t_202207131319226624891.png',
    platformNm: '미스터네이처',
    price: '3900',
    productNm: '로칼도시락 다섯가지 나물밥 & 청양고추 닭가슴살 소시지',
    productNo: 'PD20220713000000013',
    protein: '16.000',
    qty: '1',
    subCategoryCd: 'CG001001',
    subCategoryNm: '반찬포함',
  },
  {
    calorie: '320.000',
    carb: '63.000',
    categoryCd: 'CG001',
    categoryNm: '도시락',
    dietNo: 'DT20230223000000001',
    distributerBizNo: '557-81-00806',
    distributerNm: '㈜미스터네이처',
    fat: '4.500',
    mainAttId: 'PD202207131319237872447',
    mainAttUrl: '/files/pd/202207/17_t_202207131319238342731.png',
    platformNm: '미스터네이처',
    price: '3900',
    productNm: '로칼덮밥도시락 갈릭버섯 덮밥',
    productNo: 'PD20220713000000017',
    protein: '8.000',
    qty: '1',
    subCategoryCd: 'CG001002',
    subCategoryNm: '볶음밥',
  },
];
