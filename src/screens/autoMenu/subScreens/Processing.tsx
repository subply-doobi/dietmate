import {ActivityIndicator} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {Col} from '../../../shared/ui/styledComps';
import colors from '../../../shared/colors';
import {useAsync} from '../../diet/util/cartCustomHooks';
import {makeAutoMenu2} from '../../../shared/utils/autoMenu2';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
} from '../../../shared/api/queries/diet';
import {IDietTotalObjData} from '../../../shared/api/types/diet';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IProductData} from '../../../shared/api/types/product';
import {getNutrStatus} from '../../../shared/utils/sumUp';
import {
  setMenuAcActive,
  setTutorialProgress,
} from '../../../features/reduxSlices/commonSlice';
import {IAutoMenuSubPages} from '../util/contentByPages';

interface IProcessing {
  dTOData: IDietTotalObjData;
  selectedDietNo: string[];
  selectedCategory: boolean[];
  wantedCompany: string;
  priceSliderValue: number[];
  setProgress: React.Dispatch<React.SetStateAction<IAutoMenuSubPages[]>>;
}
const Processing = ({
  dTOData,
  selectedDietNo,
  selectedCategory,
  wantedCompany,
  priceSliderValue,
  setProgress,
}: IProcessing) => {
  // navigaton
  const {goBack} = useNavigation();
  const {
    params: {isOneMenuAuto, selectedOneDietNo, initialMenu},
  } = useRoute();

  // redux
  const dispatch = useDispatch();
  const {totalFoodList} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: bLData} = useGetBaseLine();
  const deleteDietDetailMutation = useDeleteDietDetail();
  const createDietDetailMutation = useCreateDietDetail();

  // memo
  const selectedCategoryIdx = useMemo(() => {
    return selectedCategory.reduce((acc, cur, idx) => {
      if (cur) acc.push(idx);
      return acc;
    }, [] as number[]);
  }, [selectedCategory]);

  // etc
  const nutrStatus = getNutrStatus({
    totalFoodList,
    bLData,
    dDData: initialMenu,
  });
  const autoMenuType =
    isOneMenuAuto && nutrStatus === 'notEnough' ? 'add' : 'overwrite';

  // 자동구성 customHook
  const {
    data: autoMenuResult,
    isError,
    isLoading,
    isSuccess,
    execute,
  } = useAsync<{
    recommendedMenu: IProductData[][];
  }>({
    asyncFunction: async () => {
      if (!bLData || !dTOData) return {recommendedMenu: []};
      const data = await makeAutoMenu2({
        totalFoodList,
        initialMenu: initialMenu,
        baseLine: bLData,
        selectedCategoryIdx,
        priceTarget: priceSliderValue,
        wantedPlatform: wantedCompany,
        menuNum: selectedDietNo.length,
      }).then(res => res);
      return data;
    },
    deps: [],
  });

  useEffect(() => {
    if (!bLData || !dTOData) return;
    if (isError) {
      setProgress(v => [...v, 'Error']);
      return;
    }
    execute();
  }, [isError]);

  // overwriteDiet (한끼니 자동구성 재시도, 전체 자동구성)
  useEffect(() => {
    if (
      !isSuccess ||
      !bLData ||
      !dTOData ||
      autoMenuResult?.recommendedMenu.length === 0 ||
      autoMenuType === 'add'
    )
      return;

    const overwriteDiet = async () => {
      // selectedMenu 에 대한 각 productNo
      let productToDeleteList: {dietNo: string; productNo: string}[] = [];
      selectedDietNo.forEach(dietNo => {
        dTOData[dietNo].dietDetail.forEach(p =>
          productToDeleteList.push({
            dietNo: p.dietNo,
            productNo: p.productNo,
          }),
        );
      });

      // 추가할 각 product 및 dietNo
      const productToAddList: {dietNo: string; food: IProductData}[] = [];
      autoMenuResult?.recommendedMenu.forEach((menu, idx) => {
        menu.forEach(product => {
          productToAddList.push({
            dietNo: selectedDietNo[idx],
            food: product,
          });
        });
      });

      // 한꺼번에 삭제/추가할 mutation list
      const deleteMutations = productToDeleteList.map(p =>
        deleteDietDetailMutation.mutateAsync({
          dietNo: p.dietNo,
          productNo: p.productNo,
        }),
      );
      const createMutations = productToAddList.map(p =>
        createDietDetailMutation.mutateAsync({
          food: p.food,
          dietNo: p.dietNo,
        }),
      );

      try {
        // 자동구성할 끼니 (선택된 끼니) 초기화 및 자동구성된 식품 각 끼니에 추가
        await Promise.all(deleteMutations);
        await Promise.all(createMutations);
      } catch (e) {
        console.log('선택된 끼니 덮어쓰기 중 오류: ', e);
      }
      dispatch(setMenuAcActive([]));
      dispatch(setTutorialProgress('Complete'));
      goBack();
    };

    overwriteDiet();
  }, [isSuccess]);

  // addMenu (남은영양 자동구성)
  useEffect(() => {
    if (
      !isSuccess ||
      !bLData ||
      !dTOData ||
      autoMenuResult?.recommendedMenu.length === 0 ||
      autoMenuType === 'overwrite'
    )
      return;

    const addMenu = async () => {
      // 추가할 각 product 및 dietNo
      const productToAddList: {dietNo: string; food: IProductData}[] = [];
      autoMenuResult?.recommendedMenu.forEach((menu, idx) => {
        menu.forEach(product => {
          productToAddList.push({
            dietNo: selectedDietNo[idx],
            food: product,
          });
        });
      });
      // 한꺼번에 추가할 mutation list
      const createMutations = productToAddList.map(p =>
        createDietDetailMutation.mutateAsync({
          food: p.food,
          dietNo: p.dietNo,
        }),
      );

      try {
        // 자동구성된 식품 각 끼니에 추가
        await Promise.all(createMutations);
      } catch (e) {
        console.log('남은영양 식품 추가 중 오류: ', e);
      }
      dispatch(setMenuAcActive([]));
      dispatch(setTutorialProgress('Complete'));
      goBack();
    };

    addMenu();
  }, [isSuccess]);

  return (
    <Col style={{justifyContent: 'center', marginTop: 64}}>
      <ActivityIndicator size={'large'} color={colors.main} />
    </Col>
  );
};

export default Processing;
