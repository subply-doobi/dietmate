import {useEffect, useReducer} from 'react';

const reducer = (state, action) => {
  switch (action.type) {
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
      };
    case 'isError':
      return {
        isLoading: false,
        data: undefined,
        error: action.error,
        isSuccess: false,
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
export const useAsync = ({
  asyncFunction,
  enabled = false,
  deps = [],
}: IUseAsync) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: undefined,
    error: undefined,
    isSuccess: false,
  });
  const runAsync = async () => {
    dispatch({type: 'isLoading'});
    try {
      setTimeout(async () => {
        const data = await asyncFunction();
        dispatch({type: 'isSuccess', data});
      }, 1200);
    } catch (error) {
      dispatch({type: 'isError', error});
    }
  };

  useEffect(() => {
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
