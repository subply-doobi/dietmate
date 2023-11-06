import {useMutation, useQueries, useQuery} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../stores/store';
import {queryClient} from '../store';
import {
  setCurrentDiet,
  setMenuActiveSection,
} from '../../stores/slices/cartSlice';
import {useHandleError} from '../../util/handleError';
import {
  DIET,
  DIET_DETAIL,
  DIET_DETAIL_ALL,
  DIET_DETAIL_EMPTY_YN,
  PRODUCT,
  PRODUCTS,
} from '../keys';
import {IMutationOptions, IQueryOptions} from '../types/common';
import {
  IDietData,
  IDietDetailData,
  IDietDetailEmptyYnData,
  IDietTotalData,
} from '../types/diet';
import {IProductData} from '../types/product';
import {mutationFn, queryFn} from './requestFn';

import {
  CREATE_DIET,
  CREATE_DIET_DETAIL,
  DELETE_DIET,
  DELETE_DIET_DETAIL,
  GET_DIET_DETAIL_EMPTY_YN,
  LIST_DIET,
  LIST_DIET_DETAIL,
  LIST_DIET_DETAIL_ALL,
  UPDATE_DIET,
  UPDATE_DIET_DETAIL,
} from './urls';
import {findDietSeq} from '../../util/findDietSeq';

// PUT //
export const useCreateDiet = (options?: IMutationOptions) => {
  const dispatch = useDispatch();
  const handleError = useHandleError();
  const mutation = useMutation({
    mutationFn: () => mutationFn(CREATE_DIET, 'put'),
    onMutate: async () => {
      // optimistic update
      // 1. Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});

      // 2. Snapshot the previous value
      const prevEmptyData = queryClient.getQueryData<IDietDetailEmptyYnData>([
        DIET_DETAIL_EMPTY_YN,
      ]);
      const newEmptyData: IDietDetailEmptyYnData = {emptyYn: 'Y'};
      // 3. Optimistically update to the new value
      if (prevEmptyData) {
        queryClient.setQueryData([DIET_DETAIL_EMPTY_YN], () => newEmptyData);
      }
      // 4. Return a context object with the snapshotted value
      return {prevEmptyData};
    },
    onSuccess: data => {
      console.log('createDiet success: ', data);
      options?.onSuccess && options?.onSuccess(data);
      // 현재 구성중인 끼니의 dietNo, dietIdx를 redux에 저장 => 장바구니와 동기화
      dispatch(setCurrentDiet(data.dietNo));

      // 장바구니 accordion 기존 끼니는 닫아주기
      dispatch(setMenuActiveSection([]));

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL]});
      queryClient.invalidateQueries({queryKey: [PRODUCTS, data.dietNo]});
    },
    onError: (error, variables, context) => {
      handleError(error);
      // 5. Rollback to the previous value
      if (context?.prevEmptyData) {
        queryClient.setQueryData(
          [DIET_DETAIL_EMPTY_YN],
          () => context.prevEmptyData,
        );
      }
    },
  });
  return mutation;
};

export const useCreateDietDetail = (options?: IMutationOptions) => {
  const onSuccess = options?.onSuccess;
  const handleError = useHandleError();
  const mutation = useMutation({
    mutationFn: ({dietNo, food}: {dietNo: string; food: IProductData}) =>
      mutationFn(
        `${CREATE_DIET_DETAIL}?dietNo=${dietNo}&productNo=${food.productNo}`,
        'put',
      ),
    onMutate: async ({dietNo, food}) => {
      // optimistic update
      // 1. Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: [PRODUCTS, dietNo]});
      await queryClient.cancelQueries({queryKey: [DIET_DETAIL, dietNo]});

      // 2. Snapshot the previous value
      const prevProductData = queryClient.getQueryData<IProductData>([PRODUCT]);
      const prevProductsData = queryClient.getQueryData<IProductData[]>([
        PRODUCTS,
        dietNo,
      ]);
      const prevDietDetailData = queryClient.getQueryData<IDietDetailData>([
        DIET_DETAIL,
        dietNo,
      ]);

      // new value
      const newDietDetailData: IDietDetailData = prevDietDetailData
        ? [...prevDietDetailData, {...food, qty: 1, dietNo}]
        : [food];

      const newProductData: IProductData | undefined = prevProductData
        ? {...prevProductData, productChoiceYn: 'Y'}
        : undefined;

      const newProductsData: IProductData[] | undefined =
        prevProductsData &&
        prevProductsData.map(prevFood =>
          prevFood.productNo === food.productNo
            ? {...food, productChoiceYn: 'Y'}
            : prevFood,
        );

      // 3. Optimistically update to the new value
      // (실패할 경우 onError에서 이전 데이터로 돌려주기 -> 5번)
      queryClient.setQueryData([PRODUCT], () => {
        return newProductData;
      });
      queryClient.setQueryData([PRODUCTS, dietNo], () => {
        return newProductsData;
      });
      queryClient.setQueryData([DIET_DETAIL, dietNo], () => {
        return newDietDetailData;
      });
      // 4. Return a context with the previous and new todo
      return {
        prevProductData,
        newProductData,
        prevProductsData,
        newProductsData,
        prevDietDetailData,
        newDietDetailData,
      };
    },
    onSuccess: (data, {dietNo, food}) => {
      // 컴포넌트로부터 전달받은 onSuccess 실행
      onSuccess && onSuccess();

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});
    },
    onError: (e, {dietNo, food}, context) => {
      // optimistic update
      // 5. Rollback to the previous value
      queryClient.setQueryData([PRODUCTS, dietNo], context?.prevProductsData);
      queryClient.setQueryData(
        [DIET_DETAIL, dietNo],
        context?.prevDietDetailData,
      );
      queryClient.setQueryData([PRODUCT], context?.prevProductData);
      handleError(e);
      console.log('useCreateDietDetail error: ', e);
    },
    // onSettled: (data, err, {dietNo, productNo}) => {
    //   queryClient.invalidateQueries({queryKey: [DIET_DETAIL, dietNo]});
    // },
  });
  return mutation;
};

// GET //
export const useListDiet = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  const additionalQK = options?.additionalQuerykey ?? [];
  return useQuery<IDietData>({
    queryKey: [DIET, ...additionalQK],
    queryFn: () => queryFn(LIST_DIET),
    enabled,
    onSuccess: data => {
      options?.onSuccess && options.onSuccess(data);
    },
  });
};

export const useListDietDetail = (dietNo: string, options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IDietDetailData>({
    queryKey: dietNo ? [DIET_DETAIL, dietNo] : [DIET_DETAIL],
    queryFn: () => queryFn(`${LIST_DIET_DETAIL}/${dietNo}`),
    enabled,
    onSuccess: data => {},
  });
};

export const useListDietDetailAll = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IDietDetailData>({
    queryKey: [DIET_DETAIL_ALL],
    queryFn: () => queryFn(LIST_DIET_DETAIL_ALL),
    enabled,
    onSuccess: data => {},
  });
};

export const useGetDietDetailEmptyYn = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IDietDetailEmptyYnData>({
    queryKey: [DIET_DETAIL_EMPTY_YN],
    queryFn: () => queryFn(GET_DIET_DETAIL_EMPTY_YN),
    enabled,
    onSuccess: data => {},
  });
};

export const useListDietTotal = (
  dietData: IDietData,
  options?: IQueryOptions,
) => {
  const enabled = options?.enabled ?? true;
  return useQueries({
    queries: dietData.map(dietData => {
      return {
        queryKey: [DIET_DETAIL, dietData.dietNo],
        queryFn: () =>
          queryFn<IDietDetailData>(`${LIST_DIET_DETAIL}/${dietData.dietNo}`),
        enabled,
      };
    }),
  });
};

// POST //
export const useUpdateDietDetail = () => {
  const mutation = useMutation({
    mutationFn: ({dietNo, qty}: {dietNo: string; qty: string}) =>
      mutationFn(`${UPDATE_DIET_DETAIL}?dietNo=${dietNo}&qty=${qty}`, 'post'),
    onSuccess: (data, {dietNo}) => {
      console.log('updateDietDetail success: ', data);
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL, dietNo]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
    },
  });
  return mutation;
};

export const useUpdateDiet = (options?: IMutationOptions) => {
  const mutation = useMutation({
    mutationFn: ({statusCd, orderNo}: {statusCd: string; orderNo: string}) =>
      mutationFn(
        `${UPDATE_DIET}?statusCd=${statusCd}&orderNo=${orderNo}`,
        'post',
      ),
    onSuccess: data => {
      console.log('updateDiet success: ', data);
      queryClient.invalidateQueries({queryKey: [DIET]});
    },
  });
  return mutation;
};
// DELETE //
export const useDeleteDiet = () => {
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const handleError = useHandleError();
  const mutation = useMutation({
    mutationFn: ({dietNo}: {dietNo: string}) =>
      mutationFn(`${DELETE_DIET}/${dietNo}`, 'delete'),
    onMutate: async ({dietNo}) => {
      // optimistic update 1. Cancel any outgoing refetches
      await queryClient.cancelQueries([DIET]);

      // optimistic update 2. Snapshot the previous value
      const prevDietData = queryClient.getQueryData<IDietData>([DIET]);

      // optimistic update 3. Optimistically update to the new value
      // (실패할 경우 onError에서 context에 담긴 이전 데이터로 돌려줘야함 -> 5번)
      if (!prevDietData) return;
      const newDietData = prevDietData.filter(diet => diet.dietNo !== dietNo);
      queryClient.setQueryData([DIET], () => newDietData);

      // optimistic update 4. Return a context object with the snapshotted value
      return {prevDietData, newDietData};
    },
    onSuccess: (data, {dietNo}: {dietNo: string}, context) => {
      // 끼니 삭제 후 현재 구성중인 끼니를 redux에 새로 저장 => 장바구니와 동기화
      const prevDietData = context?.prevDietData;
      if (!prevDietData) {
        return;
      }
      let currentDietIdx = 0;
      let nextDietIdx = 0;
      if (currentDietNo === dietNo) {
        prevDietData.forEach((diet, idx) => {
          if (diet.dietNo === dietNo) currentDietIdx = idx;
        });
        nextDietIdx = currentDietIdx === 0 ? 1 : prevDietData.length - 2;
        dispatch(setCurrentDiet(prevDietData[nextDietIdx].dietNo));
      }

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});
      queryClient.invalidateQueries({queryKey: [PRODUCTS, dietNo]});
    },
    onError: (error, {dietNo}, context) => {
      // optimistic update 5. If the mutation fails, use the context returned
      queryClient.setQueryData([DIET], context?.prevDietData);
      handleError(error);
    },
  });
  return mutation;
};

export const useDeleteDietDetail = (options?: IMutationOptions) => {
  const onSuccess = options?.onSuccess;
  const handleError = useHandleError();
  const mutation = useMutation({
    mutationFn: ({dietNo, productNo}: {dietNo: string; productNo: string}) =>
      mutationFn(
        `${DELETE_DIET_DETAIL}?dietNo=${dietNo}&productNo=${productNo}`,
        'delete',
      ),
    onMutate: async ({dietNo, productNo}) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: [PRODUCTS, dietNo]});

      // Snapshot the previous value
      const prevProductData = queryClient.getQueryData<IProductData>([PRODUCT]);
      const prevProductsData = queryClient.getQueryData<IProductData[]>([
        PRODUCTS,
        dietNo,
      ]);
      const prevDietDetailData = queryClient.getQueryData<IDietDetailData>([
        DIET_DETAIL,
        dietNo,
      ]);

      // new value
      const newDietDetailData = prevDietDetailData?.filter(
        food => food.productNo !== productNo,
      );

      const newProductData: IProductData | undefined = prevProductData
        ? {...prevProductData, productChoiceYn: 'N'}
        : undefined;

      const newProductsData: IProductData[] | undefined =
        prevProductsData &&
        prevProductsData.map(food => {
          return food.productNo === productNo
            ? {...food, productChoiceYn: 'N'}
            : food;
        });

      // Optimistically update to the new value
      queryClient.setQueryData([PRODUCT], () => {
        return newProductData;
      });
      queryClient.setQueryData([PRODUCTS, dietNo], () => {
        return newProductsData;
      });
      queryClient.setQueryData([DIET_DETAIL, dietNo], () => {
        return newDietDetailData;
      });
      // Return a context with the previous and new todo
      return {
        prevProductsData,
        newProductsData,
        prevProductData,
        newProductData,
        prevDietDetailData,
        newDietDetailData,
      };
    },
    onSuccess: (data, {dietNo, productNo}) => {
      // 컴포넌트로부터 option으로 받은 onSuccess 실행
      onSuccess && onSuccess();

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});
    },
    onError: (e, {dietNo, productNo}, context) => {
      queryClient.setQueryData([PRODUCTS, dietNo], context?.prevProductsData);
      queryClient.setQueryData(
        [DIET_DETAIL, dietNo],
        context?.prevDietDetailData,
      );
      queryClient.setQueryData([PRODUCT], context?.prevProductData);
      handleError(e);
    },
    // onSettled: (data, err, {dietNo, productNo}) => {
    //   queryClient.invalidateQueries({queryKey: [DIET_DETAIL, dietNo]});
    // },
  });
  return mutation;
};
