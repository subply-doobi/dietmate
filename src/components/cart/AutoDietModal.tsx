import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../../stores/store';
import {useListCategory} from '../../query/queries/category';
import {
  BtnCTA,
  BtnText,
  HorizontalLine,
  HorizontalSpace,
  TextMain,
} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import DSlider from '../common/slider/DSlider';
import {useCreateProductAuto} from '../../query/queries/product';
import DAlert from '../common/alert/DAlert';

interface IAutoDietModal {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const AutoDietModal = ({modalVisible, setModalVisible}: IAutoDietModal) => {
  // react-query
  const {data: categoryData} = useListCategory();
  const autoMenuMutation = useCreateProductAuto();
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // useState
  // index 0: 도시락 | 1: 닭가슴살 | 2: 샐러드 | 3: 영양간식 | 4: 과자 | 5: 음료
  const [selectedCategory, setSelectedCategory] = useState<boolean[]>([]);
  const [sliderValue, setSliderValue] = useState<number[]>([4000, 12000]);
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
  const selectedCategoryStr = categoryData?.reduce(
    (acc, cur, idx) =>
      (acc += selectedCategory[idx]
        ? idx === 0
          ? `${cur.categoryCd}`
          : `,${cur.categoryCd}`
        : ``),
    ``,
  );
  const priceRangeStr = String(sliderValue[0]) + `,` + String(sliderValue[1]);
  // console.log('AutoDietModal : selctedCategoryStr', selectedCategoryStr);
  // console.log('AutoDietModal : priceRangeStr', priceRangeStr);

  const runAutoMenu = () => {
    console.log('autoMenu! 모달창 닫기');
    autoMenuMutation.mutate({
      dietNo: currentDietNo,
      categoryText: selectedCategoryStr,
      priceText: priceRangeStr,
    });
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      transparent={true}>
      <ModalBackGround>
        <ModalContainer>
          <ModalTitle>{`추천받을 식품 유형 \n3가지 이상 선택해 주세요`}</ModalTitle>
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
                  <CheckboxImage
                    source={require(`../../assets/icons/24_checkbox_selected.png`)}
                  />
                ) : (
                  <CheckboxImage
                    source={require(`../../assets/icons/24_checkbox.png`)}
                  />
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
            onPress={runAutoMenu}>
            <BtnText>
              {btnDisabled ? `3가지 이상 선택해주세요` : `한 끼니 자동구성`}
            </BtnText>
          </BtnCTA>
        </ModalContainer>
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
