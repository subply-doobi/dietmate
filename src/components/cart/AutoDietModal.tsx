// react, RN, 3rd
import React, {useEffect, useMemo, useState} from 'react';
import {Modal, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
// doobi util, redux, etc
import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
// doobi Component
import DSlider from '../common/slider/DSlider';
import {
  BtnCTA,
  BtnText,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
// react-query
import {useListCategory} from '../../query/queries/category';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {IDietDetailData} from '../../query/types/diet';
import {useAsync} from '../../util/cart/cartCustomHooks';
import {IProductData} from '../../query/types/product';
import {setCurrentDiet} from '../../stores/slices/cartSlice';
import {useCreateDietDetail} from '../../query/queries/diet';
// import {makeAutoMenu} from '../../util/autoDietTest';
import {makeAutoMenu} from '../../util/cart/autoMenu';

interface IAutoDietModal {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dietNo: string;
  dietDetailData: IDietDetailData;
  openCurrentSection?: Function;
}
const AutoDietModal = ({
  modalVisible,
  setModalVisible,
  dietNo,
  dietDetailData,
  openCurrentSection,
}: IAutoDietModal) => {
  // redux
  const dispatch = useDispatch();
  const {totalFoodList} = useSelector((state: RootState) => state.cart);
  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: categoryData} = useListCategory();
  // const autoMenuMutation = useCreateProductAuto();
  const createDietDetailMutation = useCreateDietDetail();

  // useState
  // index 0: 도시락 | 1: 닭가슴살 | 2: 샐러드 | 3: 영양간식 | 4: 과자 | 5: 음료
  const [selectedCategory, setSelectedCategory] = useState<boolean[]>([]);
  const [sliderValue, setSliderValue] = useState<number[]>([4000, 12000]);
  const [autoFailedNum, setAutoFailedNum] = useState<number>(0);

  useEffect(() => {
    categoryData &&
      setSelectedCategory(
        Array.from({length: categoryData?.length}, () => true),
      );
  }, [categoryData?.length]);

  // etc
  const NoOfSelectedCategory = selectedCategory.reduce(
    (acc, cur) => (acc += cur ? 1 : 0),
    0,
  );
  const btnDisabled = NoOfSelectedCategory < 3 ? true : false;
  const selectedCategoryIdx = useMemo(() => {
    return selectedCategory.reduce((acc, cur, idx) => {
      if (cur) acc.push(idx);
      return acc;
    }, [] as number[]);
  }, [selectedCategory]);

  // TBD | 서버 자동구성 api 안정적으로 작동될 때 params로 필요함
  // const selectedCategoryStr = categoryData?.reduce(
  //   (acc, cur, idx) =>
  //     (acc += selectedCategory[idx]
  //       ? idx === 0
  //         ? `${cur.categoryCd}`
  //         : `,${cur.categoryCd}`
  //       : ``),
  //   ``,
  // );
  // const priceRangeStr = String(sliderValue[0]) + `,` + String(sliderValue[1]);
  // console.log('AutoDietModal : selctedCategoryStr', selectedCategoryStr);
  // console.log('AutoDietModal : priceRangeStr', priceRangeStr);

  // useAsync custom hook을 만들어서 autoMenu 실행되는 동안 인디케이터 띄우기
  const {
    data: autoMenu,
    isError,
    isLoading,
    isSuccess,
    reload,
  } = useAsync<{
    recommendedFoods: IProductData[];
    sumNutr: number[];
    sumPrice: number;
  }>({
    asyncFunction: async () => {
      const data = await makeAutoMenu({
        totalFoodList,
        dietDetail: dietDetailData,
        baseLine: baseLineData,
        selectedCategory: selectedCategoryIdx,
        priceTarget: sliderValue,
      }).then(res => res);
      return data;
    },
    deps: [dietDetailData, baseLineData],
  });

  const renderIsLoadingContent = () => {
    return (
      <AutoMenuStatusContainer>
        <AutoMenuStatusText>{`목표 영양에 딱 맞는\n식품 조합 찾는 중`}</AutoMenuStatusText>
        <ActivityIndicator
          size="large"
          color={colors.main}
          style={{marginTop: 16, marginBottom: 24}}
        />
      </AutoMenuStatusContainer>
    );
  };

  const renderIsSuccessContent = () => {
    const onAddAutoMenu = async () => {
      setModalVisible(false);
      if (!autoMenu) return;
      const addAutoMenuMutation = autoMenu?.recommendedFoods.map(food =>
        createDietDetailMutation.mutateAsync({
          dietNo,
          food,
        }),
      );
      await Promise.all(addAutoMenuMutation)
        .then(() => {
          openCurrentSection && openCurrentSection();
          dispatch(setCurrentDiet(dietNo));
        })
        .catch(e => console.log('자동구성 오류: ', e));
    };

    return (
      <AutoMenuStatusContainer>
        <AutoMenuStatusText>{`끼니 구성이 완료되었어요`}</AutoMenuStatusText>
        <NutrInfoText>
          칼로리<NutrInfoValue>{`${autoMenu?.sumNutr[0]}kcal `}</NutrInfoValue>
          탄수화물
          <NutrInfoValue>{`${autoMenu?.sumNutr[1]}g `}</NutrInfoValue>단백질
          <NutrInfoValue>{`${autoMenu?.sumNutr[2]}g `}</NutrInfoValue>지방
          <NutrInfoValue>{`${autoMenu?.sumNutr[3]}g `}</NutrInfoValue>
        </NutrInfoText>
        <Row style={{width: '100%', marginTop: 24, flexDirection: 'row'}}>
          <ConfirmBtn onPress={onAddAutoMenu}>
            <ConfirmBtnText>확인</ConfirmBtnText>
          </ConfirmBtn>
        </Row>
      </AutoMenuStatusContainer>
    );
  };
  const renderIsErrorContent = () => {
    return (
      <AutoMenuStatusContainer>
        <AutoMenuStatusText>{`식품조합을 찾지 못했습니다\n다시 시도해주세요`}</AutoMenuStatusText>
        <NutrInfoText>{`계속 찾지 못한다면 식품을 일부 제거하거나\n추천받을 카테고리 혹은 가격을 바꾸고 시도해주세요`}</NutrInfoText>
        <Row style={{width: '100%', marginTop: 24, flexDirection: 'row'}}>
          <ConfirmBtn
            onPress={() => {
              setAutoFailedNum(v => v + 1);
              setModalVisible(false);
            }}>
            <ConfirmBtnText style={{color: colors.textSub}}>
              취소
            </ConfirmBtnText>
          </ConfirmBtn>
          <ConfirmBtn
            style={{borderLeftWidth: 1, borderLeftColor: colors.inactivated}}
            onPress={() => {
              setAutoFailedNum(v => v + 1);
              reload();
            }}>
            <ConfirmBtnText>재시도</ConfirmBtnText>
          </ConfirmBtn>
        </Row>
      </AutoMenuStatusContainer>
    );
  };

  const renderBaseContent = () => {
    return (
      <ModalContainer>
        <ModalTitle>
          {'추천받을 식품 유형 \n3가지 이상 선택해 주세요'}
        </ModalTitle>
        <CategoryBox>
          {categoryData?.map((btn, idx) => (
            <CheckboxBtn
              key={btn.categoryCd}
              onPress={() => {
                setSelectedCategory(v => {
                  const modV = [...v];
                  modV[idx] = modV[idx] ? false : true;
                  return modV;
                });
              }}>
              {selectedCategory[idx] ? (
                <CheckboxImage source={icons.checkboxCheckedGreen_24} />
              ) : (
                <CheckboxImage source={icons.checkbox_24} />
              )}
              <CategoryText>{btn.categoryCdNm}</CategoryText>
            </CheckboxBtn>
          ))}
        </CategoryBox>
        <HorizontalSpace height={12} />

        <HorizontalLine />

        {/* 한 끼 가격 슬라이더 */}
        <SliderTitle>한 끼 가격</SliderTitle>
        <DSlider
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          minimumValue={4000}
          maximumValue={12000}
          step={1000}
          sliderWidth={SLIDER_WIDTH}
        />
        <HorizontalSpace height={32} />
        <BtnCTA
          btnStyle={btnDisabled ? 'inactivated' : 'activated'}
          disabled={btnDisabled}
          onPress={() => {
            setAutoFailedNum(0);
            reload();
          }}>
          <BtnText>
            {btnDisabled ? '3가지 이상 선택해주세요' : '한 끼니 자동구성'}
          </BtnText>
        </BtnCTA>
      </ModalContainer>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      transparent={true}>
      <ModalBackGround>
        {isLoading
          ? renderIsLoadingContent()
          : isSuccess
          ? renderIsSuccessContent()
          : autoFailedNum > 1 || !isError
          ? renderBaseContent()
          : renderIsErrorContent()}
      </ModalBackGround>
    </Modal>
  );
};

export default AutoDietModal;

const MODAL_WIDTH = 328;
const MODAL_INNER_WIDTH = MODAL_WIDTH - 32;
const SLIDER_WIDTH = MODAL_INNER_WIDTH - 32;

// style
const ModalBackGround = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.backgroundModal};
`;

const ModalContainer = styled.View`
  padding: 0px 16px 32px 16px;
  width: ${MODAL_WIDTH}px;
  background-color: ${colors.white};
  border-radius: 10px;
`;

const AutoMenuStatusContainer = styled.View`
  align-items: center;
  width: ${MODAL_WIDTH}px;
  background-color: ${colors.white};
  border-radius: 10px;
`;
const AutoMenuStatusText = styled(TextMain)`
  margin-top: 24px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const NutrInfoText = styled(TextMain)`
  margin-top: 16px;
  font-size: 12px;
  text-align: center;
`;
const NutrInfoValue = styled(TextSub)`
  font-size: 12px;
`;

const ConfirmBtn = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  border-top-width: 1px;
  border-top-color: ${colors.inactivated};
  align-items: center;
  justify-content: center;
`;
const ConfirmBtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.main};
`;

const ModalTitle = styled(TextMain)`
  margin-top: 40px;
  font-size: 18px;
  font-weight: bold;
`;

const CategoryBox = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 34px;
`;

const CheckboxBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: ${MODAL_INNER_WIDTH / 3}px;
  margin-bottom: 20px;
`;

const CheckboxImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const CategoryText = styled(TextMain)`
  margin-left: 10px;
  font-size: 14px;
`;

const SliderTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
`;
