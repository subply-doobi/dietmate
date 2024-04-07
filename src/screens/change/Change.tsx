// RN

// 3rd
import {useNavigation, useRoute} from '@react-navigation/native';

// doobi
import {Container, HorizontalSpace} from '../../shared/ui/styledComps';
import {useListProduct} from '../../shared/api/queries/product';
import {ISortFilter} from '../../features/reduxSlices/sortFilterSlice';
import CtaButton from '../../shared/ui/CtaButton';
import {useCallback, useEffect, useState} from 'react';
import {IProductData} from '../../shared/api/types/product';
import ChangeSummary from './ui/ChangeSummary';
import GuideTitle from '../../shared/ui/GuideTitle';
import {FlatList} from 'react-native';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../../shared/api/queries/diet';
import ChangeFoodList from './ui/ChangeFoodList';
import colors from '../../shared/colors';
import DAlert from '../../components/common/alert/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

const FOOD_ERROR_RANGE = {
  calorie: [-20, 20],
  carb: [-5, 5],
  protein: [-5, 5],
  fat: [-3, 3],
};

const Change = () => {
  // navigation
  const {
    params: {dietNo, productNo, food},
  } = useRoute();
  const {goBack} = useNavigation();

  // useState
  const [productAlertShow, setProductAlertShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    IProductData | undefined
  >();

  // sort, filter (not using redux-state)
  const appliedSortFilter: ISortFilter = {
    sort: {
      calorie: '',
      carb: '',
      protein: '',
      fat: '',
      price: '',
      priceCalorieCompare: '',
      priceProteinCompare: '',
    },
    filter: {
      category: '',
      selectedBtn: {
        calorie: [],
        carb: [],
        protein: [],
        fat: [],
        price: [],
      },
      nutrition: {
        calorie: [
          Number(food.calorie) + FOOD_ERROR_RANGE.calorie[0],
          Number(food.calorie) + FOOD_ERROR_RANGE.calorie[1],
        ],
        carb: [
          Number(food.carb) + FOOD_ERROR_RANGE.carb[0],
          Number(food.carb) + FOOD_ERROR_RANGE.carb[1],
        ],
        protein: [
          Number(food.protein) + FOOD_ERROR_RANGE.protein[0],
          Number(food.protein) + FOOD_ERROR_RANGE.protein[1],
        ],
        fat: [
          Number(food.fat) + FOOD_ERROR_RANGE.fat[0],
          Number(food.fat) + FOOD_ERROR_RANGE.fat[1],
        ],
      },
      price: [],
      search: '',
    },
    selectedFilter: 0,
  };

  // react-query
  const createDietDetailMutation = useCreateDietDetail();
  const deleteDietDetailMutation = useDeleteDietDetail();
  const {data: dDData} = useListDietDetail(dietNo, {
    enabled: dietNo ? true : false,
  });
  const {
    data: listProductData,
    refetch: refetchProduct,
    isFetching: productIsFetching,
  } = useListProduct(
    {
      dietNo,
      appliedSortFilter,
    },
    {
      enabled: dietNo ? true : false,
    },
  );

  useEffect(() => {
    const refetchAndAlert = async () => {
      (await refetchProduct()).data?.filter(v => v.productChoiceYn === 'N')
        .length === 0 && setProductAlertShow(true);
    };
    refetchAndAlert();
  }, []);

  // flatList render fn
  const renderFoodList = useCallback(
    ({item}: {item: IProductData}) => {
      return !dDData || productIsFetching ? (
        <></>
      ) : (
        <ChangeFoodList
          food={item}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      );
    },
    [dDData, selectedProduct, productIsFetching],
  );
  const extractListKey = useCallback(
    (item: IProductData) => item.productNo,
    [dDData],
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 128,
      offset: 128 * index,
      index,
    }),
    [dDData],
  );

  const onFoodChange = async () => {
    if (!selectedProduct) {
      goBack();
      return;
    }
    goBack();
    // change food
    await deleteDietDetailMutation.mutateAsync({
      dietNo,
      productNo,
    });
    await createDietDetailMutation.mutateAsync({
      dietNo,
      food: selectedProduct,
    });
  };

  return (
    <Container>
      <ChangeSummary foodToChange={food} selectedProduct={selectedProduct} />
      <HorizontalSpace height={16} />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 120,
          marginTop: 8,
        }} // 숨겨지는 header의 높이만큼 margin
        data={listProductData?.filter(v => v.productChoiceYn === 'N')}
        keyExtractor={extractListKey}
        renderItem={renderFoodList}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={() => <HorizontalSpace height={8} />}
        initialNumToRender={5}
        windowSize={2}
        maxToRenderPerBatch={7}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        refreshing={productIsFetching}
        onRefresh={() => {
          refetchProduct();
        }}
      />
      <CtaButton
        btnStyle="active"
        btnText={!selectedProduct ? '취소' : '바꾸기'}
        style={{backgroundColor: colors.dark, position: 'absolute', bottom: 8}}
        onPress={() => onFoodChange()}
      />
      {/* 알럿창 */}
      <DAlert
        alertShow={productAlertShow}
        onConfirm={() => setProductAlertShow(false)}
        onCancel={() => setProductAlertShow(false)}
        renderContent={() => (
          <CommonAlertContent text="해당 식품과 비슷한 상품이 없어요" />
        )}
        NoOfBtn={1}
      />
    </Container>
  );
};

export default Change;
