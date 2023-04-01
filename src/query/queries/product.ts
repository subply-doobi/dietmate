import {useMutation, useQuery} from '@tanstack/react-query';

import {queryClient} from '../store';
import {mutationFn, queryFn} from './requestFn';
import {DIET_DETAIL, PRODUCTS, PRODUCT} from '../keys';
import {IQueryOptions} from '../types/common';

import {
  CREATE_PRODUCT_MARK,
  DELETE_PRODUCT_MARK,
  CREATE_PRODUCT_AUTO,
  LIST_PRODUCT,
  FILTER,
  GET_PRODUCT,
} from './urls';
import {IListProductData, IProductData} from '../types/product';

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
export const useGetProduct = (
  params: {dietNo: string; productNo: string},
  options?: IQueryOptions,
) => {
  const dietNo = params.dietNo;
  const productNo = params.productNo;
  const enabled = options?.enabled ?? true;
  return useQuery<IProductData>({
    queryKey: [PRODUCT],
    queryFn: () => queryFn(`${GET_PRODUCT}/${dietNo}?productNo=${productNo}`),
    enabled,
  });
};

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

  return useQuery<IListProductData>({
    queryKey: [PRODUCTS],
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
