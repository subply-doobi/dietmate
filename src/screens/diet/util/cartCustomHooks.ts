import {useEffect, useReducer, Reducer} from 'react';

interface IState<T> {
  isLoading: boolean;
  data: T | undefined;
  error?: Error | undefined | any;
  isSuccess: boolean;
  isError: boolean;
}
interface IAction<T> {
  type: string | 'isLoading' | 'isSuccess' | 'isError';
  data?: T | undefined;
  error?: Error;
}

const reducer = <T>(state: IState<T>, action: IAction<T>) => {
  switch (action.type) {
    case 'initialized':
      return {
        isLoading: false,
        data: undefined,
        error: undefined,
        isSuccess: false,
        isError: false,
      };
    case 'isLoading':
      return {
        isLoading: true,
        data: undefined,
        error: undefined,
        isSuccess: false,
        isError: false,
      };
    case 'isSuccess':
      return {
        isLoading: false,
        data: action.data,
        error: undefined,
        isSuccess: true,
        isError: false,
      };
    case 'isError':
      return {
        isLoading: false,
        data: undefined,
        error: action.error,
        isSuccess: false,
        isError: true,
      };
    default:
      throw new Error('자동구성에 실패했어요. 잠시후 다시 이용하세요');
  }
};

interface IUseAsync {
  asyncFunction: Function;
  enabled?: boolean;
  deps?: any[];
}
export const useAsync = <T>({
  asyncFunction,
  enabled = false,
  deps = [],
}: IUseAsync) => {
  const [state, dispatch] = useReducer<Reducer<IState<T>, IAction<T>>>(
    reducer,
    {
      isLoading: false,
      data: undefined,
      error: undefined,
      isSuccess: false,
      isError: false,
    },
  );
  const runAsync = async () => {
    dispatch({type: 'isLoading'});
    setTimeout(async () => {
      try {
        const data = await asyncFunction();
        dispatch({type: 'isSuccess', data});
      } catch (error) {
        console.log('runAsync: error:', error);
        dispatch({type: 'isError', error});
      }
    }, 1200);
  };

  useEffect(() => {
    dispatch({type: 'initialized'});
    if (!enabled) return;
    runAsync();
  }, deps);

  return {
    data: state.data,
    isLoading: state.isLoading,
    isError: state.error,
    isSuccess: state.isSuccess,
    reload: runAsync,
  };
};
