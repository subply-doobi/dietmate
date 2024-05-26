import {useMutation, useQuery} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {queryClient} from '../../../app/store/reactQueryStore';
import {
  setCurrentDiet,
  setMenuAcActive,
  setProgressTooltipShow,
} from '../../../features/reduxSlices/commonSlice';

import {DIET, DIET_DETAIL_EMPTY_YN, DIET_TOTAL_OBJ, PRODUCTS} from '../keys';
import {IMutationOptions, IQueryOptions} from '../types/common';
import {
  IDietData,
  IDietDetailData,
  IDietDetailEmptyYnData,
  IDietTotalObjData,
} from '../types/diet';
import {IProductData} from '../types/product';
import {mutationFn, queryFnDDADataByDietNo} from '../requestFn';

import {
  CREATE_DIET,
  CREATE_DIET_CNT,
  CREATE_DIET_DETAIL,
  DELETE_DIET,
  DELETE_DIET_ALL,
  DELETE_DIET_DETAIL,
  UPDATE_DIET,
  UPDATE_DIET_DETAIL,
} from '../urls';
import {handleError} from '../../utils/handleError';

// PUT //
export const useCreateDiet = (options?: IMutationOptions) => {
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: () => mutationFn(CREATE_DIET, 'put'),
    onMutate: async ({setDietNo = false}: {setDietNo?: boolean}) => {
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
      return {prevEmptyData, setDietNo};
    },
    onSuccess: (data, {setDietNo}, context) => {
      // progressTooltip을 끼니나 식품을 추가/삭제 할 경우에만 띄우기 위함.
      // 툴팁 닫은 후에 화면 옮겼을 때 다시 뜨지 않도록 방지
      dispatch(setProgressTooltipShow(true));

      options?.onSuccess && options?.onSuccess(data);
      // 현재 구성중인 끼니의 dietNo, dietIdx를 redux에 저장 => 장바구니와 동기화
      setDietNo && dispatch(setCurrentDiet(data.dietNo));

      // 장바구니 accordion 기존 끼니는 닫아주기
      dispatch(setMenuAcActive([]));

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
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

export const useCreateDietCnt = (options?: IMutationOptions) => {
  const mutation = useMutation({
    mutationFn: ({dietCnt}: {dietCnt: string}) =>
      mutationFn(`${CREATE_DIET_CNT}/${dietCnt}`, 'put'),
    onSuccess: data => {
      options?.onSuccess && options?.onSuccess(data);
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
    },
    onError: e => {
      handleError(e);
      console.log('useCreateDietCnt error: ', e);
    },
  });
  return mutation;
};

export const useCreateDietDetail = (options?: IMutationOptions) => {
  const onSuccess = options?.onSuccess;
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
      await queryClient.cancelQueries({queryKey: [DIET_TOTAL_OBJ]});

      // 2. Snapshot the previous value
      const prevDTOData = queryClient.getQueryData<IDietTotalObjData>([
        DIET_TOTAL_OBJ,
      ]);

      // new value
      let newDTOData: IDietTotalObjData = prevDTOData
        ? JSON.parse(JSON.stringify(prevDTOData))
        : {};
      const dietSeq = prevDTOData?.[dietNo]?.dietSeq ?? '';
      newDTOData[dietNo].dietDetail.push({...food, qty: '1', dietNo, dietSeq});

      // 3. Optimistically update to the new value
      // (실패할 경우 onError에서 이전 데이터로 돌려주기 -> 5번)
      queryClient.setQueryData([DIET_TOTAL_OBJ], () => {
        return newDTOData;
      });
      // 4. Return a context with the previous and new todo
      return {
        prevDTOData,
        newDTOData,
      };
    },
    onSuccess: (data, {dietNo, food}) => {
      // 컴포넌트로부터 전달받은 onSuccess 실행
      onSuccess && onSuccess();

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
    },
    onError: (e, {dietNo, food}, context) => {
      // optimistic update
      // 5. Rollback to the previous value
      queryClient.setQueryData([DIET_TOTAL_OBJ], context?.prevDTOData);
      handleError(e);
      console.log('useCreateDietDetail error: ', e);
    },
  });
  return mutation;
};

// GET //
export const useListDietTotalObj = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IDietTotalObjData>({
    queryKey: [DIET_TOTAL_OBJ],
    queryFn: () => queryFnDDADataByDietNo(),
    enabled,
  });
};

// POST //
export const useUpdateDietDetail = () => {
  const mutation = useMutation({
    mutationFn: ({dietNo, qty}: {dietNo: string; qty: string}) =>
      mutationFn(`${UPDATE_DIET_DETAIL}?dietNo=${dietNo}&qty=${qty}`, 'post'),
    onSuccess: (data, {dietNo}) => {
      console.log('updateDietDetail success: ', data);
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
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
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
    },
  });
  return mutation;
};
// DELETE //
export const useDeleteDiet = () => {
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: ({dietNo}: {dietNo: string}) =>
      mutationFn(`${DELETE_DIET}/${dietNo}`, 'delete'),
    onMutate: async ({dietNo}) => {
      // optimistic update 1. Cancel any outgoing refetches
      await queryClient.cancelQueries({queryKey: [DIET_TOTAL_OBJ]});

      // optimistic update 2. Snapshot the previous value
      const prevDTOData = queryClient.getQueryData<IDietTotalObjData>([
        DIET_TOTAL_OBJ,
      ]);

      // optimistic update 3. Optimistically update to the new value
      // (실패할 경우 onError에서 context에 담긴 이전 데이터로 돌려줘야함 -> 5번)
      if (!prevDTOData) return;
      const {[dietNo]: _, ...newDTOData} = prevDTOData;

      queryClient.setQueryData([DIET_TOTAL_OBJ], () => newDTOData);

      // optimistic update 4. Return a context object with the snapshotted value
      return {prevDTOData, newDTOData};
    },
    onSuccess: (data, {dietNo}: {dietNo: string}, context) => {
      // 끼니 삭제 후 현재 구성중인 끼니를 redux에 새로 저장 => 장바구니와 동기화
      const prevDTOData = context?.prevDTOData;
      if (!prevDTOData) {
        return;
      }

      let currentDietIdx = 0;
      let nextDietIdx = 0;

      const prevDietNoArr = Object.keys(prevDTOData);
      if (prevDietNoArr.length === 1) {
        dispatch(setCurrentDiet(''));
      } else {
        prevDietNoArr.forEach(
          (prevDietNo, idx) =>
            (currentDietIdx = prevDietNo === dietNo ? idx : 0),
        );
        nextDietIdx = currentDietIdx === 0 ? 1 : prevDietNoArr.length - 2;
        dispatch(setCurrentDiet(prevDietNoArr[nextDietIdx]));
      }

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
      queryClient.invalidateQueries({queryKey: [PRODUCTS, dietNo]});
    },
    onError: (error, {dietNo}, context) => {
      // optimistic update 5. If the mutation fails, use the context returned
      queryClient.setQueryData([DIET_TOTAL_OBJ], context?.prevDTOData);
      handleError(error);
    },
  });
  return mutation;
};

export const useDeleteDietAll = () => {
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: () => mutationFn(DELETE_DIET_ALL, 'delete'),
    onMutate: async () => {
      // optimistic update 1. Cancel any outgoing refetches
      await queryClient.cancelQueries({queryKey: [DIET_TOTAL_OBJ]});

      // optimistic update 2. Snapshot the previous value
      const prevDTOData = queryClient.getQueryData<IDietTotalObjData>([
        DIET_TOTAL_OBJ,
      ]);

      // optimistic update 3. Optimistically update to the new value
      // (실패할 경우 onError에서 context에 담긴 이전 데이터로 돌려줘야함 -> 5번)
      if (!prevDTOData) return;
      const newDTOData: IDietTotalObjData = {};

      queryClient.setQueryData([DIET_TOTAL_OBJ], () => newDTOData);

      // optimistic update 4. Return a context object with the snapshotted value
      return {prevDTOData, newDTOData};
    },
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
      queryClient.invalidateQueries({queryKey: [PRODUCTS]});
      dispatch(setCurrentDiet(''));
    },
    onError: (error, _, context) => {
      // optimistic update 5. If the mutation fails, use the context returned
      queryClient.setQueryData([DIET_TOTAL_OBJ], context?.prevDTOData);
      handleError(error);
    },
  });
  return mutation;
};

export const useDeleteDietDetail = (options?: IMutationOptions) => {
  const onSuccess = options?.onSuccess;
  const mutation = useMutation({
    mutationFn: ({dietNo, productNo}: {dietNo: string; productNo: string}) =>
      mutationFn(
        `${DELETE_DIET_DETAIL}?dietNo=${dietNo}&productNo=${productNo}`,
        'delete',
      ),
    onMutate: async ({dietNo, productNo}) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: [DIET_TOTAL_OBJ]});

      // Snapshot the previous value
      const prevDTOData = queryClient.getQueryData<IDietDetailData>([
        DIET_TOTAL_OBJ,
      ]);

      // new value
      let newDTOData: IDietTotalObjData = prevDTOData
        ? JSON.parse(JSON.stringify(prevDTOData))
        : {};
      newDTOData[dietNo].dietDetail = newDTOData[dietNo].dietDetail.filter(
        p => p.productNo !== productNo,
      );

      queryClient.setQueryData([DIET_TOTAL_OBJ], () => {
        return newDTOData;
      });

      // Return a context with the previous and new todo
      return {
        prevDTOData,
        newDTOData,
      };
    },
    onSuccess: (data, {dietNo, productNo}) => {
      // 컴포넌트로부터 option으로 받은 onSuccess 실행
      onSuccess && onSuccess();

      // invalidation
      queryClient.invalidateQueries({queryKey: [DIET_TOTAL_OBJ]});
    },
    onError: (e, {dietNo, productNo}, context) => {
      queryClient.setQueryData([DIET_TOTAL_OBJ], context?.prevDTOData);
      handleError(e);
    },
  });
  return mutation;
};
