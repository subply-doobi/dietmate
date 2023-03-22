import axios from 'axios';
import {queryClient} from '../store';
import {
  BASE_URL,
  CREATE_PRODUCT_MARK,
  DELETE_PRODUCT_MARK,
  CREATE_PRODUCT_AUTO,
  LIST_PRODUCT,
  FILTER,
} from './urls';
import {validateToken} from './token';

import {useMutation, useQueries, useQuery} from '@tanstack/react-query';
import {mutationFn, queryFn} from './requestFn';
import {DIET_DETAIL, PRODUCT, PRODUCT_AUTO} from '../keys';
import {IMutationOptions, IQueryOptions} from '../types/common';
import {ICreateProductAutoParams, IListProductParams} from '../types/product';
import {useDispatch} from 'react-redux';
import React, {SetStateAction} from 'react';

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
    onError: e => {
      console.log('useFilterRange Error: ', e);
    },
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
