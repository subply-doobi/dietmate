import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../shared/colors';
import {useListOrder} from '../../shared/api/queries/order';
import {
  reGroupByDietNo,
  regroupByBuyDateAndDietNo,
} from '../../shared/utils/regroup';
import {useListDietDetailAll} from '../../shared/api/queries/diet';
import {Row, TextMain, TextSub} from '../../shared/ui/styledComps';
import {BASE_URL} from '../../shared/api/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {icons} from '../../shared/iconSource';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

const HomeCheckList = params => {
  // params
  const {orderDate} = params.route.params;

  // navigation
  const navigation = useNavigation();

  //react-query
  const {data: orderData, isLoading} = useListOrder();
  const {data: dietDetailAllData} = useListDietDetailAll();

  //asyncStorage
  const storeCheckList = async () => {
    try {
      await AsyncStorage.setItem('CHECK_LIST', JSON.stringify(checkList));
    } catch (e) {
      console.log(e);
    }
  };
  const getCheckList = async () => {
    const checkList = await AsyncStorage.getItem('CHECK_LIST');
    return checkList;
  };
  useEffect(() => {
    getCheckList().then(res => setCheckList(JSON.parse(res)));
  }, []);

  //initial state
  const initialCheckList = dietDetailAllData.map(item => {
    //item에서 중복제거
    return {
      dietSeq: item.dietSeq,
      complete: false,
    };
  });
  const newInitialCheckList = initialCheckList.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        t => t.dietSeq === item.dietSeq && t.complete === item.complete,
      ),
  );

  //state
  const [checkList, setCheckList] = useState(newInitialCheckList);

  // useEffect
  useEffect(() => {
    navigation.setOptions({
      title: `${orderDate} 주문`,
    });
  }, []);
  useEffect(() => {
    storeCheckList();
  }, [checkList]);
  const regroupedData = reGroupByDietNo(dietDetailAllData);

  //checkList 전부 완료되었는지 확인
  const isAllComplete = checkList.every(item => item.complete === true);
  useEffect(() => {
    if (isAllComplete) {
      setComplete(true);
    }
  }, [isAllComplete]);
  const [complete, setComplete] = useState(false);
  const completeText = `식단을 완료했어요 \n 체형이나 체중변화가 있었나요? `;
  const completeSubText = `더 정확한 식단을 위해 \n 목표칼로리를 재설정해주세요`;
  return (
    <ScrollView>
      <Container>
        <Card>
          <PercentageText>50% 완료</PercentageText>
          {regroupedData.map((data, index) => {
            const dietSeq = data[0].dietSeq;
            const isChecked =
              checkList.find(item => item.dietSeq === dietSeq)?.complete ===
              true;

            return (
              <ContentsCard
                key={index}
                onPress={() => {
                  setCheckList(
                    checkList.map(item => {
                      if (item.dietSeq === data[0].dietSeq) {
                        return {
                          dietSeq: item.dietSeq,
                          complete: !item.complete,
                        };
                      }
                      return item;
                    }),
                  );
                }}>
                <Row style={{justifyContent: 'space-between'}}>
                  <Text>{dietSeq}</Text>
                  {isChecked ? (
                    <CheckImage source={icons.checkRoundChecked_24} />
                  ) : (
                    <CheckImage source={icons.round_20} />
                  )}
                </Row>
                {!isChecked && (
                  <>
                    {data.map((item, index) => (
                      <View key={index}>
                        <Row>
                          <ThumbnailImg
                            source={{
                              uri: `${BASE_URL}${item.mainAttUrl}`,
                            }}
                          />
                          <MakeVertical>
                            <SellerText>{item.platformNm}</SellerText>
                            <ProductNmText>{item.productNm}</ProductNmText>
                          </MakeVertical>
                        </Row>
                      </View>
                    ))}
                  </>
                )}
              </ContentsCard>
            );
          })}
        </Card>
      </Container>
      <DAlert
        alertShow={complete}
        onConfirm={() => {
          navigation.navigate('UserInput', {from: 'Mypage'});
          setComplete(false);
        }}
        onCancel={() => setComplete(false)}
        NoOfBtn={2}
        confirmLabel="재설정"
        cancelLabel="그대로 진행"
        renderContent={() => (
          <CommonAlertContent text={completeText} subText={completeSubText} />
        )}
      />
    </ScrollView>
  );
};

export default HomeCheckList;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.backgroundLight};
`;

const Card = styled.View`
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

const ContentsCard = styled.TouchableOpacity`
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

const PercentageText = styled.Text`
  font-size: 12px;
  color: ${colors.textSub};
  align-self: center;
`;

const ThumbnailImg = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 5px;
`;

const ProductNmText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const SellerText = styled(TextSub)`
  font-size: 14px;
`;

const MakeVertical = styled.View`
  flex-direction: column;
  margin-left: 10px;
`;

const CheckImage = styled.Image`
  width: 24px;
  height: 24px;
`;
