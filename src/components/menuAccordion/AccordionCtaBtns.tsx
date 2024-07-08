// RN
import styled from 'styled-components/native';
import {ViewProps} from 'react-native';

// 3rd
import {RootState} from '../../app/store/reduxStore';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

// doobi
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {getNutrStatus} from '../../shared/utils/sumUp';
import {IDietDetailData} from '../../shared/api/types/diet';
import {
  setAutoMenuStatus,
  setTutorialProgress,
} from '../../features/reduxSlices/commonSlice';
import {IProductData} from '../../shared/api/types/product';
import {makeAutoMenu2} from '../../shared/utils/autoMenu2';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
} from '../../shared/api/queries/diet';
import {Col, Row} from '../../shared/ui/styledComps';
import CtaButton from '../../shared/ui/CtaButton';

const SELECTED_CATEGORY_IDX = [0, 1, 2, 3, 4, 5];
const PRICE_TARGET = [0, 12000];
const MENU_NUM = 1;
const INITIAL_STATUS = {isLoading: true, isSuccess: false, isError: false};
const SUCCESS_STATUS = {isLoading: false, isSuccess: true, isError: false};
const ERROR_STATUS = {isLoading: false, isSuccess: false, isError: true};
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
  const deleteDietDetailMutation = useDeleteDietDetail();

  // etc
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const btnText =
    nutrStatus === 'satisfied' || nutrStatus === 'exceed'
      ? '자동구성 재시도'
      : nutrStatus === 'notEnough'
        ? '남은 영양만큼 자동구성'
        : '자동구성';

  const autoMenuType = btnText === '자동구성 재시도' ? 'overwrite' : 'add';
  const autoBtnStyle =
    nutrStatus === 'empty'
      ? 'border'
      : nutrStatus === 'notEnough'
        ? 'borderActive'
        : 'border';
  const addBtnStyle = nutrStatus === 'empty' ? 'borderActive' : 'border';

  // fn
  const addMenu = async (data: IProductData[][]) => {
    // 추가할 각 product 및 dietNo
    const productToAddList: {dietNo: string; food: IProductData}[] = [];
    data?.forEach((menu, idx) => {
      menu.forEach(product => {
        productToAddList.push({
          dietNo,
          food: product,
        });
      });
    });
    // 한꺼번에 추가할 mutation list
    try {
      // 자동구성된 식품 각 끼니에 추가
      await Promise.all(
        productToAddList.map(p =>
          createDietDetailMutation.mutateAsync({
            food: p.food,
            dietNo: p.dietNo,
          }),
        ),
      );
    } catch (e) {
      console.log('식품 추가 중 오류: ', e);
    }
  };

  const overwriteMenu = async (data: IProductData[][]) => {
    // selectedMenu 에 대한 각 productNo
    let productToDeleteList: {dietNo: string; productNo: string}[] = [];
    dDData.forEach(
      p =>
        p.productNo &&
        productToDeleteList.push({
          dietNo: p.dietNo,
          productNo: p.productNo,
        }),
    );

    try {
      // 자동구성할 끼니 (선택된 끼니) 초기화 및 자동구성된 식품 각 끼니에 추가
      await Promise.all(
        productToDeleteList.map(p =>
          deleteDietDetailMutation.mutateAsync({
            dietNo: p.dietNo,
            productNo: p.productNo,
          }),
        ),
      );
      await addMenu(data);
    } catch (e) {
      console.log('선택된 끼니 삭제 중 오류: ', e);
    }
  };

  const setOneAutoMenu = async () => {
    if (!bLData || totalFoodList?.length === 0) {
      dispatch(setAutoMenuStatus(ERROR_STATUS));
      return;
    }

    dispatch(setAutoMenuStatus(INITIAL_STATUS));
    let recommendedMenu: IProductData[][] = [];

    // deley for 3seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 자동구성
    try {
      recommendedMenu = (
        await makeAutoMenu2({
          totalFoodList,
          initialMenu: autoMenuType === 'add' && dDData ? dDData : [],
          baseLine: bLData,
          selectedCategoryIdx: SELECTED_CATEGORY_IDX,
          priceTarget: PRICE_TARGET,
          wantedPlatform: '',
          menuNum: MENU_NUM,
        })
      ).recommendedMenu;
    } catch (e) {
      dispatch(setAutoMenuStatus(ERROR_STATUS));
      console.log('자동구성 중 오류 발생: ', e);
      return;
    }
    // 자동구성된 메뉴 추가
    try {
      autoMenuType === 'add'
        ? await addMenu(recommendedMenu)
        : await overwriteMenu(recommendedMenu);
      dispatch(setAutoMenuStatus(SUCCESS_STATUS));
      dispatch(setTutorialProgress('ChangeFood'));
    } catch (e) {
      console.log('식품추가 중 오류 발생: ', e);
      dispatch(setAutoMenuStatus(ERROR_STATUS));
      return;
    }
  };

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
            onPress={() => setOneAutoMenu()}
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
