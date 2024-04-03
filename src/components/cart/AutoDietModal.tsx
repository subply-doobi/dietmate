// react, RN, 3rd
import {useEffect, useMemo, useState} from 'react';
import {Modal, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
// doobi util, redux, etc
import {RootState} from '../../app/store/reduxStore';
import colors from '../../shared/colors';
import {useAsync} from '../../screens/cart/util/cartCustomHooks';
import {setCurrentDiet} from '../../features/reduxSlices/commonSlice';
// doobi Component
import {
  BtnCTA,
  BtnText,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import DSlider from '../common/slider/DSlider';
// react-query
import {useListCategory} from '../../shared/api/queries/category';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {IDietDetailData} from '../../shared/api/types/diet';
import {IProductData} from '../../shared/api/types/product';
import {useCreateDietDetail} from '../../shared/api/queries/diet';
import {makeAutoMenu2} from '../../screens/cart/util/autoMenu2';
import DDropdown from '../../shared/ui/DDropdown';

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
  const {totalFoodList, platformDDItems} = useSelector(
    (state: RootState) => state.common,
  );

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: categoryData} = useListCategory();
  const createDietDetailMutation = useCreateDietDetail();

  // useState
  // index 0: 도시락 | 1: 닭가슴살 | 2: 샐러드 | 3: 영양간식 | 4: 과자 | 5: 음료
  const [selectedCategory, setSelectedCategory] = useState<boolean[]>([]);
  const [sliderValue, setSliderValue] = useState<number[]>([4000, 12000]);
  const [autoFailedNum, setAutoFailedNum] = useState<number>(0);
  const [wantedPlatform, setWantedPlatform] = useState<string>('');

  useEffect(() => {
    categoryData &&
      setSelectedCategory(
        Array.from({length: categoryData?.length}, () => true),
      );
  }, [categoryData?.length, categoryData]);

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

  const {
    data: autoMenu,
    isError,
    isLoading,
    isSuccess,
    reload,
  } = useAsync<{
    recommendedFoods: IProductData[];
    sum: number[];
  }>({
    asyncFunction: async () => {
      const data = await makeAutoMenu2({
        totalFoodList,
        initialMenu: dietDetailData,
        baseLine: baseLineData,
        selectedCategoryIdx,
        priceTarget: sliderValue,
        wantedPlatform,
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
      if (autoMenu?.recommendedFoods.length === 0) {
        return;
      }
      if (!autoMenu) return;

      // TODO | 이미 들어가있는 것 제외하고 data를 받아와야함
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
          칼로리<NutrInfoValue>{`${autoMenu?.sum[0]}kcal `}</NutrInfoValue>
          탄수화물
          <NutrInfoValue>{`${autoMenu?.sum[1]}g `}</NutrInfoValue>단백질
          <NutrInfoValue>{`${autoMenu?.sum[2]}g `}</NutrInfoValue>지방
          <NutrInfoValue>{`${autoMenu?.sum[3]}g `}</NutrInfoValue>
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
        {/* 식품유형은 일단 생략 */}
        {/* <ModalTitle>
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

        <HorizontalLine /> */}

        {/* 해당 판매자 식품을 하나 이상 포함 */}
        <OptionTitle>{'해당 식품사를 포함해서 자동구성'}</OptionTitle>
        <DDropdown
          placeholder="식품사"
          value={wantedPlatform}
          setValue={setWantedPlatform}
          items={platformDDItems}
        />

        {/* 한 끼 가격 슬라이더 */}
        <OptionTitle>한 끼 가격</OptionTitle>
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

const OptionTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
`;
