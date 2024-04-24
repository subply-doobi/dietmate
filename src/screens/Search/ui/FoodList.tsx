// react, RN, 3rd
import {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  PanResponder,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// doobi util, redux, etc
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';
import {icons} from '../../../shared/iconSource';
import colors from '../../../shared/colors';
import {commaToNum, sumUpNutrients} from '../../../shared/utils/sumUp';
import {BASE_URL} from '../../../shared/api/urls';

// doobi Component
import {Col, Row, TextMain, TextSub} from '../../../shared/ui/styledComps';
import DeleteAlertContent from '../../../components/common/alert/DeleteAlertContent';
import DAlert from '../../../shared/ui/DAlert';

// react-query
import {IProductData} from '../../../shared/api/types/product';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../../../shared/api/queries/diet';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';
import {
  NUTR_ERROR_RANGE,
  SERVICE_PRICE_PER_PRODUCT,
} from '../../../shared/constants';
import {useDeleteProductMark} from '../../../shared/api/queries/product';

interface IFoodList {
  item: IProductData;
  screen?: string;
}

const FoodList = ({item, screen = 'Search'}: IFoodList) => {
  const {navigate} = useNavigation();
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });
  const {data: baseLineData} = useGetBaseLine();
  const addMutation = useCreateDietDetail();
  const deleteMutation = useDeleteDietDetail();
  const deleteProductMarkMutation = useDeleteProductMark();

  // state
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);

  // etc
  // 장바구니에 해당 상품이 들어있는지
  const isAdded = item.productChoiceYn === 'Y';
  // 남은 영양 계산
  const {calExceed, carbExceed, proteinExceed, fatExceed} = useMemo(() => {
    if (!dietDetailData || !baseLineData) {
      return {
        calExceed: false,
        carbExceed: false,
        proteinExceed: false,
        fatExceed: false,
      };
    }
    const {cal, carb, protein, fat} = sumUpNutrients(dietDetailData);
    return {
      calExceed:
        parseInt(baseLineData.calorie) + NUTR_ERROR_RANGE.calorie[1] - cal <
        parseInt(item.calorie),
      carbExceed:
        parseInt(baseLineData.carb) + NUTR_ERROR_RANGE.carb[1] - carb <
        parseInt(item.carb),
      proteinExceed:
        parseInt(baseLineData.protein) + NUTR_ERROR_RANGE.protein[1] - protein <
        parseInt(item.protein),
      fatExceed:
        parseInt(baseLineData.fat) + NUTR_ERROR_RANGE.fat[1] - fat <
        parseInt(item.fat),
    };
  }, [dietDetailData, baseLineData]);

  // onDelete | onAdd | onLikeDelete fn
  const onDelete = () => {
    deleteMutation.mutate({
      dietNo: currentDietNo,
      productNo: item.productNo,
    });
    setDeleteAlertShow(false);
    aniPValue.setValue(removedP);
  };

  const onAdd = () => {
    addMutation.mutate({dietNo: currentDietNo, food: item});
    aniPValue.setValue(addedP);
  };

  const onLikeDelete = () => {
    deleteProductMarkMutation.mutate(item.productNo);
  };

  // animation
  const addedP = -70;
  const removedP = 70;
  const initialP = isAdded ? addedP : removedP;
  const aniPValue = useRef(new Animated.Value(initialP)).current;

  // 터치 이동거리 (aniPValue)에 따라 변화시켜줄 값.
  // (AddedMark의 width) & (AddedMark 안 장바구니 아이콘 scale)
  const aniWidthByPosition = aniPValue.interpolate({
    inputRange: [addedP, removedP],
    outputRange: [72, 0],
    extrapolate: 'clamp',
  });
  const aniScaleByPosition = aniPValue.interpolate({
    inputRange: [addedP, removedP],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 식품 추가 / 삭제 / 취소 애니메이션
  const addCartAni = Animated.timing(aniPValue, {
    toValue: addedP,
    useNativeDriver: false,
    duration: 100,
  });

  const removeCartAni = Animated.timing(aniPValue, {
    toValue: removedP,
    useNativeDriver: false,
    duration: 100,
  });

  useEffect(() => {
    aniPValue.setValue(isAdded ? addedP : removedP);
  }, [item, isAdded]);

  return (
    <Container>
      {/* 전체 범위 클릭하면 식품 상세정보로 이동 */}
      <Box>
        {/* 썸네일 이미지 */}
        <TouchableOpacity
          onPress={() => navigate('FoodDetail', {productNo: item.productNo})}>
          <Thumbnail
            source={{
              uri: `${BASE_URL}${item?.mainAttUrl}`,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ProductInfoContainer
          onPress={() =>
            isAdded ? setDeleteAlertShow(true) : addCartAni.start(onAdd)
          }>
          <Col>
            <SellerText numberOfLines={1} ellipsizeMode="tail">
              {item?.platformNm}
            </SellerText>
            <ProductName numberOfLines={2} ellipsizeMode="tail">
              {item?.productNm}
            </ProductName>

            {/* 칼탄단지정보 클릭하면 식품추가 or 삭제 */}
            <NutrSummary>
              <Nutr>
                <NutrText>칼로리</NutrText>
                <NutrValue willExceed={calExceed}>
                  {' '}
                  {parseInt(item.calorie)} kcal
                </NutrValue>
              </Nutr>
              <Nutr style={{marginTop: 2}}>
                <NutrText>탄수화물</NutrText>
                <NutrValue willExceed={carbExceed}>
                  {' '}
                  {parseInt(item.carb)}g {'  '}
                </NutrValue>
                <NutrText>단백질</NutrText>
                <NutrValue willExceed={proteinExceed}>
                  {' '}
                  {parseInt(item.protein)}g {'  '}
                </NutrValue>
                <NutrText>지방</NutrText>
                <NutrValue willExceed={fatExceed}>
                  {' '}
                  {parseInt(item.fat)}g {'  '}
                </NutrValue>
              </Nutr>
            </NutrSummary>
          </Col>
          <Row style={{justifyContent: 'space-between'}}>
            {!!item.price && (
              <Price>
                {commaToNum(parseInt(item.price) + SERVICE_PRICE_PER_PRODUCT)}원
              </Price>
            )}
            {screen === 'Likes' && (
              <DeleteLikeFoodBtn onPress={onLikeDelete}>
                {/* <LikeImg source={icons.likeSmall_20} /> */}
                <DeleteLikeFoodBtnText>찜 취소</DeleteLikeFoodBtnText>
              </DeleteLikeFoodBtn>
            )}
          </Row>
        </ProductInfoContainer>

        {/* 식품 추가하거나 삭제했을 때 나올 장바구니담김 표시 */}
        <AniAddedMark
          style={{width: aniWidthByPosition}}
          onPress={() => setDeleteAlertShow(true)}>
          <AniCartImage
            style={{transform: [{scale: aniScaleByPosition}]}}
            source={icons.cartWhite_40}
          />
        </AniAddedMark>

        {/* 식품 삭제알럿. 없어도 무방하기는 할 듯 */}
        <DAlert
          alertShow={deleteAlertShow}
          confirmLabel="삭제"
          onConfirm={() => removeCartAni.start(onDelete)}
          onCancel={() => {
            setDeleteAlertShow(false);
          }}
          renderContent={() => <DeleteAlertContent deleteText={'해당식품을'} />}
        />

        {/* currentDietNo 없을 때 (끼니 자체가 없을 때) 식품 추가/삭제 방지 */}
      </Box>
    </Container>
  );
};

export default FoodList;

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  height: 152px;
  padding: 0px 16px;
`;

const Box = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: row;
  padding-bottom: 20px;
`;

const Thumbnail = styled.Image`
  width: 132px;
  height: 132px;
  border-radius: 5px;
`;

const ProductInfoContainer = styled.TouchableOpacity`
  flex: 1;
  margin-left: 16px;
  justify-content: space-between;
`;

const SellerText = styled(TextSub)`
  font-size: 11px;
  font-weight: bold;
`;

const ProductName = styled(TextMain)`
  margin-top: 2px;
  font-size: 14px;
  font-weight: bold;
`;

const NutrSummary = styled.View`
  width: 100%;
  height: 42px;
  border-radius: 5px;
  margin-top: 6px;
  padding: 4px;
  background-color: ${colors.backgroundLight};
`;

const Nutr = styled.View`
  flex-direction: row;
`;

const NutrText = styled(TextSub)`
  font-size: 11px;
`;

const NutrValue = styled(TextMain)<{willExceed: boolean}>`
  font-size: 11px;
  color: ${({willExceed}) => (willExceed ? colors.warning : colors.textMain)};
`;
const Price = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const DeleteLikeFoodBtn = styled.TouchableOpacity`
  width: 56px;
  height: 24px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${colors.inactivated};
`;

const LikeImg = styled.Image`
  width: 16px;
  height: 16px;
`;

const DeleteLikeFoodBtnText = styled(TextSub)`
  margin-left: 2px;
  font-size: 14px;
`;

const AniAddedMark = styled(Animated.createAnimatedComponent(Pressable))`
  width: 64px;
  height: 100%;
  /* border-radius: 5px; */
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  position: absolute;
  background-color: ${colors.cartMark};
  justify-content: center;
  align-items: center;
`;

const AniCartImage = styled(Animated.createAnimatedComponent(Image))`
  width: 36px;
  height: 36px;
`;
