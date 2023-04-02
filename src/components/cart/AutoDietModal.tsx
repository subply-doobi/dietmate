import React, {useEffect, useMemo, useState} from 'react';
import {Modal, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
import {
  BtnCTA,
  BtnText,
  HorizontalLine,
  HorizontalSpace,
  TextMain,
} from '../../styles/styledConsts';

import DSlider from '../common/slider/DSlider';

import {useCreateProductAuto} from '../../query/queries/product';
import {useListCategory} from '../../query/queries/category';
import {makeAutoMenu} from '../../util/autoDietTest';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {useListDietDetail} from '../../query/queries/diet';
import {IDietDetailData} from '../../query/types/diet';
import {useAsync} from '../../util/cart/CartCustomHooks';

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
  const {totalFoodList} = useSelector((state: RootState) => state.cart);
  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: categoryData} = useListCategory();
  const autoMenuMutation = useCreateProductAuto();

  // useState
  // index 0: 도시락 | 1: 닭가슴살 | 2: 샐러드 | 3: 영양간식 | 4: 과자 | 5: 음료
  const [selectedCategory, setSelectedCategory] = useState<boolean[]>([]);
  const [sliderValue, setSliderValue] = useState<number[]>([4000, 12000]);
  // const [isAutoMenuLoading, setIsAutoMenuLoading] = useState(false);

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
  const {data, isError, isLoading, isSuccess, reload} = useAsync({
    asyncFunction: async () => {
      const data = await makeAutoMenu(
        totalFoodList,
        dietDetailData,
        baseLineData,
        selectedCategoryIdx,
        sliderValue[1],
      ).then(res => res.recommendedFoods);
      setModalVisible(false);
      openCurrentSection && openCurrentSection();
      return data;
    },
  });

  console.log('AutoDietModal : isLoading', isLoading);
  // console.log('AutoDietModal : isSuccess', isSuccess);

  // useEffect로 직접 autoMenu 실행되는 동안 인디케이터 띄우기
  // const runAutoMenu = async () => {
  //   const data = await makeAutoMenu(
  //     totalFoodList,
  //     dietDetailData,
  //     baseLineData,
  //     selectedCategoryIdx,
  //     sliderValue[1],
  //   ).then(res => res.recommendedFoods);
  //   setModalVisible(false);
  //   openCurrentSection && openCurrentSection();
  // };

  // useEffect(() => {
  //   if (!isAutoMenuLoading) return;
  //   setTimeout(() => {
  //     runAutoMenu();
  //     setIsAutoMenuLoading(false);
  //   }, 3000);
  // }, [isAutoMenuLoading]);
  // console.log('AutoDietModal: loading: ', isAutoMenuLoading);
  return (
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      transparent={true}>
      <ModalBackGround>
        {isLoading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={colors.main} />
          </LoadingContainer>
        ) : (
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
              // onPress={() => setIsAutoMenuLoading(true)}>
              onPress={reload}>
              <BtnText>
                {btnDisabled ? '3가지 이상 선택해주세요' : '한 끼니 자동구성'}
              </BtnText>
            </BtnCTA>
          </ModalContainer>
        )}
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

const LoadingContainer = styled.View`
  padding: 0px 16px 32px 16px;
  width: ${MODAL_WIDTH}px;
  background-color: ${colors.white};
  border-radius: 10px;
`;

const ModalTitle = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
  margin-top: 40px;
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
