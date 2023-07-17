import {useMutation, useQuery} from '@tanstack/react-query';

import {queryClient} from '../store';
import {mutationFn, queryFn} from './requestFn';
import {DIET_DETAIL, PRODUCTS, PRODUCT, MARK} from '../keys';
import {IQueryOptions} from '../types/common';

import {
  CREATE_PRODUCT_MARK,
  DELETE_PRODUCT_MARK,
  CREATE_PRODUCT_AUTO,
  LIST_PRODUCT,
  FILTER,
  GET_PRODUCT,
  LIST_PRODUCT_MARK,
} from './urls';
import {
  IListProductParams,
  IProductData,
  IProductsData,
} from '../types/product';

// PUT //
export const useCreateProductMark = () => {
  const mutation = useMutation({
    mutationFn: (productNo: string) =>
      mutationFn(`${CREATE_PRODUCT_MARK}/${productNo}`, 'put'),
    onSuccess: data => {
      console.log('like!');
      queryClient.invalidateQueries({queryKey: [MARK]});
      queryClient.invalidateQueries({queryKey: [PRODUCT]});
    },
  });
  return mutation;
};

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
  params: IListProductParams,
  options?: IQueryOptions,
) => {
  const enabled = options?.enabled ?? true;
  const dietNo = params?.dietNo ? params.dietNo : '';
  const searchText = params?.searchText ? params?.searchText : '';
  const categoryCd = params?.categoryCd ? params?.categoryCd : '';
  const sort = params?.sort ? params?.sort : '';
  const filter = params?.filter
    ? params?.filter
    : {
        categoryParam: '',
        nutritionParam: {
          calorieParam: [],
          carbParam: [],
          proteinParam: [],
          fatParam: [],
        },
        priceParam: [],
      };

  const calorie = filter.nutritionParam.calorieParam;
  const carb = filter.nutritionParam.carbParam;
  const protein = filter.nutritionParam.proteinParam;
  const fat = filter.nutritionParam.fatParam;
  const price = filter.priceParam;

  const categoryParam = categoryCd === '' ? '' : categoryCd;

  const calorieParam =
    calorie.length === 2 ? `Calorie,${calorie[0]},${calorie[1]}|` : '';
  const carbParam = carb.length === 2 ? `Carb,${carb[0]},${carb[1]}|` : '';
  const proteinParam =
    protein.length === 2 ? `Protein,${protein[0]},${protein[1]}|` : '';
  const fatParam = fat.length === 2 ? `Fat,${fat[0]},${fat[1]}|` : '';
  const priceParam = price.length === 2 ? `Price,${price[0]},${price[1]}|` : '';

  return useQuery<IProductsData>({
    queryKey: [PRODUCTS, dietNo],
    queryFn: () =>
      queryFn(
        `${LIST_PRODUCT}/${dietNo}?searchText=${searchText}&categoryCd=${categoryParam}&sort=${sort}&filter=${calorieParam}${carbParam}${proteinParam}${fatParam}${priceParam}`,
      ),
    enabled,
    onSuccess: data => {
      options?.onSuccess && options?.onSuccess(data);
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

export const useListProductMark = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IProductsData>({
    queryKey: [MARK],
    queryFn: () => queryFn(`${LIST_PRODUCT_MARK}`),
    onSuccess: data => {
      options?.onSuccess && options?.onSuccess(data);
      console.log('listProductMark: ', data);
    },
    enabled,
  });
};

// DELETE //
export const useDeleteProductMark = () => {
  const mutation = useMutation({
    mutationFn: (productNo: string) =>
      mutationFn(`${DELETE_PRODUCT_MARK}/${productNo}`, 'delete'),
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: [MARK]});
      queryClient.invalidateQueries({queryKey: [PRODUCT]});
    },
  });
  return mutation;
};
