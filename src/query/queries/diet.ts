import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentDietNo} from '../../stores/slices/cartSlice';
import {RootState} from '../../stores/store';
import {sumUpNutrients} from '../../util/sumUp';
import {
  DIET,
  DIET_DETAIL,
  DIET_DETAIL_ALL,
  DIET_DETAIL_EMPTY_YN,
  PRODUCT,
} from '../keys';
import {queryClient} from '../store';
import {IMutationOptions, IQueryOptions} from '../types/common';
import {
  IDietData,
  IDietDetailData,
  IDietDetailEmptyYnData,
  IListDietDetailParams,
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
  LIST_PRODUCT,
  UPDATE_DIET_DETAIL,
} from './urls';
// PUT //
export const useCreateDiet = (options?: IMutationOptions) => {
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: () => mutationFn(CREATE_DIET, 'put'),
    onSuccess: data => {
      options?.onSuccess && options?.onSuccess(data);
      dispatch(setCurrentDietNo(data.dietNo));
      queryClient.invalidateQueries({queryKey: [DIET]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});
      queryClient.invalidateQueries({queryKey: [PRODUCT]});
    },
    onError: e => console.log('useCreateDiet error: ', e),
  });
  return mutation;
};

export const useCreateDietDetail = () => {
  const mutation = useMutation({
    mutationFn: ({dietNo, productNo}: {dietNo: string; productNo: string}) =>
      mutationFn(
        `${CREATE_DIET_DETAIL}?dietNo=${dietNo}&productNo=${productNo}`,
        'put',
      ),
    onMutate: async ({dietNo, productNo}) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: [PRODUCT]});
      await queryClient.cancelQueries({queryKey: [DIET_DETAIL, dietNo]});

      // Snapshot the previous value
      const prevProductData = queryClient.getQueryData<IProductData[]>([
        PRODUCT,
      ]);
      const prevDietDetailData = queryClient.getQueryData<IDietDetailData>([
        DIET_DETAIL,
        dietNo,
      ]);
      let newDietDetailData: IDietDetailData = [];

      const newProductData: IProductData[] | undefined =
        prevProductData &&
        prevProductData.map(food => {
          if (productNo === food.productNo) {
            if (prevDietDetailData && prevDietDetailData.length === 0) {
              newDietDetailData = [{...food, qty: food.minQty}];
            }
            if (prevDietDetailData && prevDietDetailData.length > 0) {
              newDietDetailData = [
                ...prevDietDetailData,
                {...food, qty: food.minQty},
              ];
            }
          }
          return food.productNo === productNo
            ? {...food, productChoiceYn: 'Y'}
            : food;
        });

      // Optimistically update to the new value
      queryClient.setQueryData([PRODUCT], () => {
        return newProductData;
      });
      queryClient.setQueryData([DIET_DETAIL, dietNo], () => {
        return newDietDetailData;
      });
      // Return a context with the previous and new todo
      return {
        prevProductData,
        newProductData,
        prevDietDetailData,
        newDietDetailData,
      };
    },
    onSuccess: (data, {dietNo, productNo}) => {
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});
    },
    onError: (e, {dietNo, productNo}, context) => {
      queryClient.setQueryData([PRODUCT], context?.prevProductData);
      queryClient.setQueryData(
        [DIET_DETAIL, dietNo],
        context?.prevDietDetailData,
      );
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

// POST //
export const useUpdateDietDetail = () => {
  const mutation = useMutation({
    mutationFn: ({
      dietNo,
      productNo,
      qty,
    }: {
      dietNo: string;
      productNo: string;
      qty: string;
    }) =>
      mutationFn(
        `${UPDATE_DIET_DETAIL}?dietNo=${dietNo}&productNo=${productNo}&qty=${qty}`,
        'post',
      ),
    onSuccess: (data, {dietNo}) => {
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL, dietNo]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
    },
    onError: e => console.log('useUpdateDietDetail error: ', e),
  });
  return mutation;
};

// DELETE //
export const useDeleteDiet = () => {
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: ({dietNo}: {dietNo: string}) =>
      mutationFn(`${DELETE_DIET}/${dietNo}`, 'delete'),
    onSuccess: (data, {dietNo}: {dietNo: string}) => {
      const prevDietData = queryClient.getQueryData<IDietData>([DIET]);
      let nextDietIdx = 0;
      let currentDietIdx = 0;
      if (!prevDietData) {
        return;
      }
      if (currentDietNo === dietNo) {
        prevDietData.forEach((diet, idx) => {
          if (diet.dietNo === dietNo) currentDietIdx = idx;
        });
        nextDietIdx = currentDietIdx === 0 ? 1 : prevDietData.length - 2;
        dispatch(setCurrentDietNo(prevDietData[nextDietIdx].dietNo));
      }

      queryClient.invalidateQueries({queryKey: [DIET]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});
      queryClient.invalidateQueries({queryKey: [PRODUCT]});
    },
    onError: e => console.log('useDeleteDiet error: ', e),
  });
  return mutation;
};

export const useDeleteDietDetail = () => {
  const mutation = useMutation({
    mutationFn: ({dietNo, productNo}: {dietNo: string; productNo: string}) =>
      mutationFn(
        `${DELETE_DIET_DETAIL}?dietNo=${dietNo}&productNo=${productNo}`,
        'delete',
      ),
    onMutate: async ({dietNo, productNo}) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: [PRODUCT]});
      // Snapshot the previous value
      const prevProductData = queryClient.getQueryData<IProductData[]>([
        PRODUCT,
      ]);
      const prevDietDetailData = queryClient.getQueryData<IDietDetailData>([
        DIET_DETAIL,
        dietNo,
      ]);

      let newDietDetailData: IDietDetailData = [];
      prevDietDetailData?.forEach(food => {
        food.productNo !== productNo && newDietDetailData.push(food);
      });

      const newProductData: IProductData[] | undefined =
        prevProductData &&
        prevProductData.map(food => {
          return food.productNo === productNo
            ? {...food, productChoiceYn: 'N'}
            : food;
        });

      // Optimistically update to the new value
      queryClient.setQueryData([PRODUCT], () => {
        return newProductData;
      });
      queryClient.setQueryData([DIET_DETAIL, dietNo], () => {
        return newDietDetailData;
      });
      // Return a context with the previous and new todo
      return {
        prevProductData,
        newProductData,
        prevDietDetailData,
        newDietDetailData,
      };
    },
    onSuccess: (data, {dietNo, productNo}) => {
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_EMPTY_YN]});
    },
    onError: (e, {dietNo, productNo}, context) => {
      queryClient.setQueryData([PRODUCT], context?.prevProductData);
      queryClient.setQueryData(
        [DIET_DETAIL, dietNo],
        context?.prevDietDetailData,
      );
      console.log('useDeleteDietDetail error: ', e);
    },
    // onSettled: (data, err, {dietNo, productNo}) => {
    //   queryClient.invalidateQueries({queryKey: [DIET_DETAIL, dietNo]});
    // },
  });
  return mutation;
};
