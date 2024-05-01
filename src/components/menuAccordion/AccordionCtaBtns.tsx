// react, RN, 3rd
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../shared/iconSource';

// doobi Component
import {BtnCTA, Col, Icon, Row, TextSub} from '../../shared/ui/styledComps';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';
import {getNutrStatus, sumUpNutrients} from '../../shared/utils/sumUp';
import {IDietDetailData} from '../../shared/api/types/diet';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import CtaButton from '../../shared/ui/CtaButton';
import colors from '../../shared/colors';
import {SCREENWIDTH} from '../../shared/constants';
import {useNavigation} from '@react-navigation/native';
import {ViewProps} from 'react-native';
import {
  setAutoMenuStatus,
  setTutorialProgress,
} from '../../features/reduxSlices/commonSlice';
import DAlert from '../../shared/ui/DAlert';
import {useAsync} from '../../screens/diet/util/cartCustomHooks';
import {IProductData} from '../../shared/api/types/product';
import {makeAutoMenu2} from '../../screens/diet/util/autoMenu2';
import {
  useCreateDietDetail,
  useListDietDetail,
} from '../../shared/api/queries/diet';
import {useEffect} from 'react';

interface IAccordionCtaBtns extends ViewProps {
  dDData: IDietDetailData;
  dietNo: string;
  onlyAuto?: boolean;
  onlyAdd?: boolean;
}
const AccordionCtaBtns = ({
  dDData,
  dietNo,
  onlyAdd,
  onlyAuto,
  ...props
}: IAccordionCtaBtns) => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {totalFoodList, isTutorialMode, tutorialProgress} = useSelector(
    (state: RootState) => state.common,
  );

  // react-query
  const {data: bLData} = useGetBaseLine();
  const createDietDetailMutation = useCreateDietDetail();

  // autoMenu custom hook
  const {
    data: autoMenuResult,
    isError,
    isLoading,
    isSuccess,
    reload,
  } = useAsync<{
    recommendedMenu: IProductData[][];
  }>({
    asyncFunction: async () => {
      if (!bLData) return {recommendedMenu: []};
      const data = await makeAutoMenu2({
        totalFoodList,
        initialMenu: dDData,
        baseLine: bLData,
        selectedCategoryIdx: [0, 1, 2, 3, 4, 5],
        priceTarget: [0, 12000],
        wantedPlatform: '',
        menuNum: 1,
      }).then(res => res);
      return data;
    },
    deps: [dDData, bLData],
  });

  // etc
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const btnText =
    nutrStatus === 'satisfied' || nutrStatus === 'exceed'
      ? '자동구성 재시도'
      : nutrStatus === 'notEnough'
        ? '남은 영양만큼 자동구성'
        : '자동구성';
  const autoBtnStyle =
    dDData?.length === 0
      ? 'border'
      : nutrStatus === 'notEnough'
        ? 'borderActive'
        : 'border';
  const addBtnStyle = dDData?.length === 0 ? 'borderActive' : 'border';

  // fn
  const addMenu = async () => {
    // 추가할 각 product 및 dietNo
    const productToAddList: {dietNo: string; food: IProductData}[] = [];
    autoMenuResult?.recommendedMenu.forEach((menu, idx) => {
      menu.forEach(product => {
        productToAddList.push({
          dietNo,
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
  };

  // autoMenuStatus control
  useEffect(() => {
    if (isLoading) {
      dispatch(
        setAutoMenuStatus({isLoading: true, isSuccess: false, isError: false}),
      );
      return;
    }

    if (isError) {
      dispatch(
        setAutoMenuStatus({isLoading: false, isSuccess: false, isError: true}),
      );
      return;
    }
    if (!isSuccess) return;

    const addAutoMenu = async () => {
      await addMenu();
      isTutorialMode && dispatch(setTutorialProgress('ChangeFood'));
      dispatch(
        setAutoMenuStatus({isLoading: false, isSuccess: true, isError: false}),
      );
    };
    addAutoMenu();
  }, [isLoading]);

  return (
    <Col {...props}>
      <Row style={{justifyContent: 'space-between', columnGap: 8}}>
        {!onlyAuto ? (
          <CtaButton
            shadow={false}
            btnStyle={addBtnStyle}
            // btnContent={() => <Icon source={icons.plus_24} />}
            btnText="+"
            style={{width: 48, height: 48, borderWidth: 2}}
            onPress={() => {
              isTutorialMode && dispatch(setTutorialProgress('SelectFood'));
              navigate('ManualAdd');
            }}
          />
        ) : (
          <Dummy />
        )}
        {!onlyAdd && (
          <CtaButton
            shadow={false}
            btnStyle={autoBtnStyle}
            btnTextStyle={{fontSize: 14}}
            btnText={btnText}
            style={{
              flex: 1,
              height: 48,
              borderWidth: 2,
            }}
            onPress={() => reload()}
          />
        )}
      </Row>
    </Col>
  );
};

export default AccordionCtaBtns;

const Dummy = styled.View`
  width: 48px;
  height: 48px;
`;
