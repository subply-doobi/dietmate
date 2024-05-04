import {FlatList, ScrollView, Text} from 'react-native';
import {
  HorizontalSpace,
  TextMain,
  TextSub,
  VerticalLine,
} from '../../shared/ui/styledComps';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  useGetBaseLine,
  useUpdateBaseLine,
} from '../../shared/api/queries/baseLine';
import {useEffect, useMemo, useState} from 'react';
import {loadBaseLineData} from '../../features/reduxSlices/userInputSlice';
import colors from '../../shared/colors';
import NutrChangeAlert from '../mypage/ui/NutrientChangeAlert';
import WeightChangeAlert from '../mypage/ui/WeightChangeAlert';
import CalChangeAlert from '../mypage/ui/CalorieChangeAlert';
import {
  convertNutr,
  convertNutrByWeight,
} from '../../shared/utils/targetCalculation';
import styled from 'styled-components/native';
import {icons} from '../../shared/iconSource';
import NutrTarget from '../../components/common/nutrient/NutrientTarget';
import PageBtn from '../mypage/ui/PageBtn';

import {SCREENWIDTH} from '../../shared/constants';
import {
  reGroupByDietNo,
  regroupByBuyDateAndDietNo,
} from '../../shared/utils/regroup';
import {commaToNum, sumUpDietTotal} from '../../shared/utils/sumUp';
import {useListDietDetailAll} from '../../shared/api/queries/diet';
import DAlert from '../../shared/ui/DAlert';
import {useListOrder} from '../../shared/api/queries/order';
import AsyncStorage from '@react-native-async-storage/async-storage';

type IAlertType =
  | 'calorieChange'
  | 'carbChange'
  | 'proteinChange'
  | 'fatChange'
  | 'weightChange';

// FlatList Data
type INutrFLdata = Array<{
  nutrient: string;
  value: number;
  color: string;
  alertType: IAlertType;
}>;
// alert render fn
interface IRenderAlert {
  [key: string]: () => React.ReactElement;
}

const NewHome = () => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const userInputState = useSelector((state: RootState) => state.userInput);

  // react-query
  const updateMutation = useUpdateBaseLine();
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietDetailAllData} = useListDietDetailAll();
  const {data: orderData, isLoading} = useListOrder();

  // useState
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertType, setAlertType] = useState<IAlertType>('calorieChange');

  // 총 끼니 수, 상품 수, 금액 계산
  const dietTotalData = reGroupByDietNo(dietDetailAllData);
  const {menuNum, productNum, priceTotal} = sumUpDietTotal(dietTotalData);

  // useEffect
  useEffect(() => {
    baseLineData && dispatch(loadBaseLineData(baseLineData));
  }, [baseLineData]);

  // btns
  const myPageBtns = [
    {
      title: '몸무게변경',
      btnId: 'ChangeWeight',
      onPress: () => {
        baseLineData && dispatch(loadBaseLineData(baseLineData));
        setAlertType('weightChange');
        setAlertShow(true);
      },
    },
    {
      title: '찜한 상품',
      btnId: 'Likes',
      onPress: () => {
        navigate('Likes');
      },
    },
    {
      title: '주문내역',
      btnId: 'OrderHistory',
      onPress: () => navigate('OrderHistoryNav', {screen: 'OrderHistory'}),
    },
    {title: '공지사항', btnId: 'Notice', onPress: () => navigate('Notice')},
    {title: '계정설정', btnId: 'Account', onPress: () => navigate('Account')},
    {
      title: '문의하기',
      btnId: 'Inquiry',
      onPress: () => link(INQUIRY_URL),
    },
  ];

  // Flatlist Data
  const nutrTargetData: INutrFLdata = useMemo(
    () => [
      {
        nutrient: '칼로리',
        value: parseFloat(baseLineData?.calorie || '0'),
        color: colors.main,
        alertType: 'calorieChange',
      },
      {
        nutrient: '탄수화물',
        value: parseFloat(baseLineData?.carb || '0'),
        color: colors.blue,
        alertType: 'carbChange',
      },
      {
        nutrient: '단백질',
        value: parseFloat(baseLineData?.protein || '0'),
        color: colors.green,
        alertType: 'proteinChange',
      },
      {
        nutrient: '지방',
        value: parseFloat(baseLineData?.fat || '0'),
        color: colors.orange,
        alertType: 'fatChange',
      },
    ],
    [baseLineData],
  );

  // alert render fn
  const renderAlertByType: IRenderAlert = {
    calorieChange: () => <CalChangeAlert />,
    carbChange: () => <NutrChangeAlert type="carbChange" />,
    proteinChange: () => <NutrChangeAlert type="proteinChange" />,
    fatChange: () => <NutrChangeAlert type="fatChange" />,
    weightChange: () => (
      <WeightChangeAlert
        autoCalculate={autoCalculate}
        setAutoCalculate={setAutoCalculate}
      />
    ),
  };

  // 알럿 창 확인버튼 동작
  const onAlertConfirm = () => {
    if (!baseLineData) {
      setAlertShow(false);
      return;
    }

    // 변경된 몸무게만 업데이트
    if (alertType === 'weightChange' && !autoCalculate) {
      updateMutation.mutate({
        ...baseLineData,
        weight: userInputState.weightChange.value,
      });
      setAlertShow(false);
      return;
    }

    // 변경된 몸무게와 자동계산된 영양 업데이트
    if (alertType === 'weightChange' && autoCalculate) {
      const {calorie, carb, protein, fat} = convertNutrByWeight(
        userInputState.weightChange.value,
        baseLineData,
      );
      updateMutation.mutate({
        ...baseLineData,
        calorie,
        carb,
        protein,
        fat,
        weight: userInputState.weightChange.value,
      });
      setAlertShow(false);
      return;
    }

    // 선택된 영양으로 다른 영양 자동 계산해서 업데이트
    const {calorie, carb, protein, fat} = convertNutr[alertType](
      baseLineData.calorie,
      userInputState[alertType].value,
    );
    updateMutation.mutate({
      ...baseLineData,
      calorie,
      carb,
      protein,
      fat,
    });
    setAlertShow(false);
    return;
  };

  const onAlertCancel = () => {
    setAlertShow(false);
  };
  // 구매날짜, dietNo로 식단 묶기
  const regroupedData = regroupByBuyDateAndDietNo(orderData);
  const date = regroupedData[0]?.[0]?.[0]?.buyDate || '';

  //date를 2024.03.06. 18:00에서 2024.03.06 형식으로
  const dateSplit = date.split(' ');
  const dateOnly = dateSplit[0];

  //식사를 하실 때 체크할 때 날짜 형식
  const formattedDate =
    dateOnly.slice(2, 4) +
    '.' +
    dateOnly.slice(5, 7) +
    '.' +
    dateOnly.slice(8, 10);

  //AsyncStorage에 저장된 complete값 가져오기
  const getCheckList = async () => {
    const checkList = await AsyncStorage.getItem('CHECK_LIST');
    return checkList;
  };
  useEffect(() => {
    getCheckList().then(res => console.log('newHome:', res));
  }, []);

  return (
    <ScrollView>
      <Container>
        {/* 상단 카드 */}
        <Card>
          <ProfileContainer>
            <ProfileTextContainer>
              <NickName>
                {baseLineData?.nickNm}{' '}
                <Text style={{fontWeight: '100'}}>님</Text>
              </NickName>
              <Hello>다이어트 메이트가 즐거운 식단실천을 응원합니다</Hello>
            </ProfileTextContainer>
          </ProfileContainer>
        </Card>

        {/* 목표 영양 변경*/}
        <RecommendationContainer>
          <Recommendation numberOfLines={1} style={{fontWeight: '400'}}>
            한 끼 목표 영양
          </Recommendation>
          <UserInfoBtnContainer
            onPress={() => {
              navigate('UserInput', {from: 'Mypage'});
            }}>
            <UserInfoBtnText>목표변경</UserInfoBtnText>
            <RightArrow source={icons.arrowRight_20} />
          </UserInfoBtnContainer>
        </RecommendationContainer>

        {/* 칼탄단지 변경 버튼 */}
        <Card>
          <TargetNutrContainer>
            <FlatList
              data={nutrTargetData}
              keyExtractor={item => item.nutrient}
              renderItem={({item}) => (
                <NutrTarget
                  nutrient={item.nutrient}
                  value={String(item.value)}
                  color={item.color}
                  onPress={() => {
                    baseLineData && dispatch(loadBaseLineData(baseLineData));
                    setAlertType(item.alertType);
                    setAlertShow(true);
                  }}
                />
              )}
              horizontal={true}
              ItemSeparatorComponent={() => <VerticalLine />}
            />
          </TargetNutrContainer>
        </Card>
        <HorizontalSpace height={24} />
        {menuNum === 0 ? (
          <ContentsCard>
            <ContentsText>새로운 식단 구성을 기다리고 있어요</ContentsText>
            <BtnBox>
              <ContentsText
                style={{color: 'white', alignSelf: 'center', marginTop: 14}}>
                식단 구성하기
              </ContentsText>
            </BtnBox>
          </ContentsCard>
        ) : (
          <ContentsCard>
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <CardHeaderContainer>
                <SideImage source={icons.redAlert_24} />
                <ContentsText>구매 대기 중인 끼니가 있어요</ContentsText>
              </CardHeaderContainer>
              <DetailBtnContainer
                onPress={() => {
                  navigate('Cart');
                }}>
                <SubText>끼니상세</SubText>
                <RightArrow source={icons.arrowRight_20} />
              </DetailBtnContainer>
            </Row>
            <Row>
              <SideImage source={icons.dietImage_24} />
              <LastOrderText>{menuNum}개 끼니</LastOrderText>
            </Row>
            <Row>
              <SideImage source={icons.creditImage_24} />
              <LastOrderText>{commaToNum(priceTotal)}원</LastOrderText>
            </Row>
            <BtnBox
              onPress={() => {
                navigate('Cart');
              }}>
              <ContentsText
                style={{color: 'white', alignSelf: 'center', marginTop: 14}}>
                식단 구매하기
              </ContentsText>
            </BtnBox>
          </ContentsCard>
        )}

        <ContentsCard>
          {orderData?.length > 0 ? (
            <>
              <Row
                style={{justifyContent: 'space-between', alignItems: 'center'}}>
                <CardHeaderContainer>
                  <ContentsText>식사를 하실 때 체크해보세요</ContentsText>
                </CardHeaderContainer>
                <DetailBtnContainer
                  onPress={() => {
                    console.log('기록보기');
                  }}>
                  <SubText>기록보기</SubText>
                  <RightArrow source={icons.arrowRight_20} />
                </DetailBtnContainer>
              </Row>
              {regroupedData?.map((order, orderIdx) => (
                <OrderBox
                  key={orderIdx}
                  onPress={() => {
                    navigate('HomeCheckList', {
                      orderDate: formattedDate,
                    });
                  }}>
                  <Row style={{justifyContent: 'space-between'}}>
                    <CheckListOrderDateText>
                      {formattedDate} 주문
                    </CheckListOrderDateText>
                    <CheckListPercentText>50% 완료</CheckListPercentText>
                  </Row>
                </OrderBox>
              ))}
            </>
          ) : (
            <CardHeaderContainer>
              <SideImage source={icons.redAlert_24} />
              <ContentsText>아직 주문한 끼니가 없어요</ContentsText>
            </CardHeaderContainer>
          )}
        </ContentsCard>
        <HorizontalSpace height={24} />
        {orderData?.length > 0 ? (
          <ContentsCard>
            <Row
              style={{justifyContent: 'space-between', alignItems: 'center'}}>
              <CardHeaderContainer>
                <SideImage source={icons.checkRoundChecked_24} />
                <ContentsText>마지막 주문 정보</ContentsText>
              </CardHeaderContainer>
              <DetailBtnContainer
                onPress={() => {
                  console.log('주문전체정보');
                }}>
                <SubText>주문전체정보</SubText>
                <RightArrow source={icons.arrowRight_20} />
              </DetailBtnContainer>
            </Row>
            <LastOrderBox>
              <Row style={{justifyContent: 'center', marginBottom: 16}}>
                <TextMain>
                  칼로리 {'\n'}
                  {Math.floor(baseLineData?.calorie)}kcal
                </TextMain>
                <VerticalLine style={{marginLeft: 10, marginRight: 10}} />
                <TextMain>
                  탄수화물
                  {'\n'}
                  {Math.floor(baseLineData?.carb)}g
                </TextMain>
                <VerticalLine style={{marginLeft: 10, marginRight: 10}} />
                <TextMain>
                  단백질
                  {'\n'}
                  {Math.floor(baseLineData?.protein)}g
                </TextMain>
                <VerticalLine style={{marginLeft: 10, marginRight: 10}} />
                <TextMain>
                  지방
                  {'\n'}
                  {Math.floor(baseLineData?.fat)}g
                </TextMain>
              </Row>
              <Row>
                <SideImage source={icons.dietImage_24} />
                <LastOrderText>{dateOnly}</LastOrderText>
              </Row>
              <Row>
                <SideImage source={icons.dietImage_24} />
                <LastOrderText>{menuNum}개 끼니</LastOrderText>
              </Row>
              <Row>
                <SideImage source={icons.creditImage_24} />
                <LastOrderText>{commaToNum(priceTotal)}원</LastOrderText>
              </Row>
            </LastOrderBox>
          </ContentsCard>
        ) : (
          <></>
        )}
        <ContentsCard>
          <ContentsText>이벤트 배너</ContentsText>
        </ContentsCard>

        {/* 변경 알럿창 */}
        <DAlert
          alertShow={alertShow}
          renderContent={() => renderAlertByType[alertType]()}
          onConfirm={onAlertConfirm}
          onCancel={onAlertCancel}
          confirmLabel="변경"
        />
      </Container>
    </ScrollView>
  );
};

export default NewHome;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.backgroundLight};
`;

const Card = styled.View`
  width: 100%;
  height: auto;
  background-color: ${colors.white};
  padding: 0px 16px 16px 16px;
  elevation: 0;
`;

const ContentsCard = styled.View`
  background-color: ${colors.white};
  border-radius: 4px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  margin: 10px;
  padding: 10px;
`;

const ProfileContainer = styled.View`
  margin-top: 24px;
  flex-direction: row;
  justify-content: space-between;
`;

const ProfileTextContainer = styled.View``;

const NickName = styled(TextMain)`
  font-size: 20px;
  font-weight: 700;
`;
const Hello = styled(TextMain)`
  margin-top: 4px;
  font-size: 14px;
`;

const RecommendationContainer = styled.View`
  height: 34px;
  background-color: ${colors.highlight2};
  flex-direction: row;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
`;

const Recommendation = styled(TextMain)`
  font-size: 16px;
  font-weight: 300;
`;

const UserInfoBtnContainer = styled.TouchableOpacity`
  flex-direction: row;
`;
const DetailBtnContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

const UserInfoBtnText = styled(TextSub)``;

const TargetNutrContainer = styled.View`
  width: 100%;
  margin-top: 16px;
  /* flex-direction: row; */
  /* justify-content: center; */
`;

const RightArrow = styled.Image`
  width: 16px;
  height: 16px;
`;

const Row = styled.View`
  flex-direction: row;
`;

const ContentsText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const BtnBox = styled.TouchableOpacity`
  width: ${SCREENWIDTH - 32}px;
  align-self: center;
  background-color: ${colors.dark};
  margin: 32px;
  border-radius: 4px;
  height: 52px;
`;

const SubText = styled(TextSub)``;

const LastOrderText = styled(TextMain)`
  font-size: 14px;
`;

const OrderDate = styled(TextSub)`
  font-size: 12px;
`;

const CheckListOrderDateText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const CheckListPercentText = styled(TextSub)`
  font-size: 14px;
  font-weight: bold;
`;

const DietCheckContainer = styled.View`
  padding: 16px;
  border-radius: 4px;
  background-color: ${colors.backgroundLight2};
`;

const OrderBox = styled.TouchableOpacity`
  background-color: ${colors.white};
  border-radius: 4px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  margin: 10px;
  padding: 10px;
`;

const LastOrderBox = styled.View`
  padding: 16px;
  border-radius: 4px;
`;

const DetailBtn = styled.TouchableOpacity`
  width: 64px;
  height: 24px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${colors.lineLight};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  margin-left: 8px;
`;

const DetailBtnText = styled(TextMain)`
  font-size: 14px;
`;

const CardHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SideImage = styled.Image`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;
