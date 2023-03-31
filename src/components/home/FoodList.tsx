// react, RN, 3rd
import {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Pressable, PanResponder, View, Image} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// doobi util, redux, etc
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
import {commaToNum, sumUpNutrients} from '../../util/sumUp';
import {BASE_URL} from '../../query/queries/urls';

// doobi Component
import {Col, StyledProps, TextMain, TextSub} from '../../styles/styledConsts';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';
import DAlert from '../common/alert/DAlert';

// react-query
import {IProductData} from '../../query/types/product';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../../query/queries/diet';
import {useGetBaseLine} from '../../query/queries/baseLine';

interface IFoodList {
  item: IProductData;
}

const FoodList = ({item}: IFoodList) => {
  const {navigate} = useNavigation();
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  const {data: dietDetailData} = useListDietDetail(currentDietNo);
  const {data: baseLineData} = useGetBaseLine();
  const addMutation = useCreateDietDetail();
  const deleteMutation = useDeleteDietDetail();

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
      calExceed: parseInt(baseLineData.calorie) - cal < parseInt(item.calorie),
      carbExceed: parseInt(baseLineData.carb) - carb < parseInt(item.carb),
      proteinExceed:
        parseInt(baseLineData.protein) - protein < parseInt(item.protein),
      fatExceed: parseInt(baseLineData.fat) - fat < parseInt(item.fat),
    };
  }, [dietDetailData, baseLineData]);

  // onDelete | onAdd fn
  const onDelete = () => {
    deleteMutation.mutate({
      dietNo: currentDietNo,
      productNo: item.productNo,
    });
    setDeleteAlertShow(false);
    aniPValue.setValue(removedP); // TBD | onSuccess 이후에 실행되어야함
  };

  const onAdd = () => {
    addMutation.mutate({dietNo: currentDietNo, productNo: item.productNo});
    aniPValue.setValue(addedP); // TBD | onSuccess 이후에 실행되어야함
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
    outputRange: [1, 0.6],
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

  const cancelAni = Animated.timing(aniPValue, {
    toValue: initialP,
    useNativeDriver: false,
    duration: 100,
  });

  // 터치 감지
  // 보통 panResponder에 useref().current 적용해서 사용하는데
  // useRef 로 사용하면 onAdd/ onDelete 후 리렌더링 될 때
  // initialP가 바뀌어도 panResponder의 값이 안변함.
  // 우리는 식품이 추가되고 삭제되면 panResponder도 변겨되어야해서 useRef 안씀
  const panResponder = PanResponder.create({
    // onStartShouldSetPanResponder: (_, {dx}) => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dx < -5 || gestureState.dx > 5;
    },
    onPanResponderMove: (_, {dx}) => {
      aniPValue.setValue(initialP + dx);
    },
    onPanResponderRelease: (_, {dx}) => {
      if (isAdded) {
        dx + initialP > 0 ? removeCartAni.start(onDelete) : cancelAni.start();
      } else {
        dx + initialP < 0 ? addCartAni.start(onAdd) : cancelAni.start();
      }
    },
  });

  useEffect(() => {
    aniPValue.setValue(isAdded ? addedP : removedP);
  }, [item, isAdded]);

  return (
    <AniContainer {...panResponder.panHandlers}>
      {/* 전체 범위 클릭하면 식품 상세정보로 이동 */}
      <Button onPress={() => navigate('FoodDetail', {item: item})}>
        <Thumbnail
          source={{
            uri: `${BASE_URL}${item?.mainAttUrl}`,
          }}
          resizeMode="contain"
        />
        <ProductInfoContainer>
          <Col>
            <SellerText numberOfLines={1} ellipsizeMode="tail">
              {item?.platformNm}
            </SellerText>
            <ProductName numberOfLines={2} ellipsizeMode="tail">
              {item?.productNm}
            </ProductName>

            {/* 칼탄단지정보 클릭하면 식품추가 or 삭제 */}
            <NutrSummaryBtn
              onPress={() => {
                isAdded ? setDeleteAlertShow(true) : addCartAni.start(onAdd);
              }}>
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
            </NutrSummaryBtn>
          </Col>
          <Price>{commaToNum(item?.price)}원</Price>
        </ProductInfoContainer>

        {/* 식품 추가하거나 삭제했을 때 나올 장바구니담김 표시 */}
        <AniAddedMark
          style={{width: aniWidthByPosition}}
          onPress={() => setDeleteAlertShow(true)}>
          <AniCartImage
            {...panResponder.panHandlers}
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
      </Button>
    </AniContainer>
  );
};

export default FoodList;

const AniContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100%;
  flex-direction: row;
  height: 152px;
`;
const Button = styled.Pressable`
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

const ProductInfoContainer = styled.View`
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

const Price = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;
const NutrSummaryBtn = styled.TouchableOpacity`
  width: 100%;
  height: 42px;
  border-radius: 5px;
  margin-top: 8px;
  padding: 4px
  background-color: ${colors.backgroundLight};
`;

const Nutr = styled.View`
  flex-direction: row;
`;

const NutrText = styled(TextSub)`
  font-size: 11px;
`;

const NutrValue = styled(TextMain)`
  font-size: 11px;
  color: ${({willExceed}: StyledProps) =>
    willExceed ? colors.warning : colors.textMain};
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
