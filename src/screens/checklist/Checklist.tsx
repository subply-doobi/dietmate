// RN
import {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';

// 3rd
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';

// doobi
import FoodList from './ui/FoodList';
import {ShadowView} from '../../shared/ui/styledComps';
import {
  Col,
  Container,
  HorizontalSpace,
  Icon,
  Row,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {icons} from '../../shared/iconSource';
import {parseDate} from '../../shared/utils/dateParsing';
import {IFlattedOrderedProduct} from './util/menuFlat';
import {updateTotalCheckList} from '../../shared/utils/asyncStorage';
import PieChart from 'react-native-pie-chart';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

const Checklist = () => {
  // navigation
  const {navigate, reset, setOptions} = useNavigation();
  const route = useRoute();
  const order: IFlattedOrderedProduct[][] = route.params?.order;
  const initialChecklist = route.params?.checklist;

  // useState
  // map 안에서 asyncStorage에 직접 접근할 수 없음. -> state와 동시에 관리해서
  // rendering할 때는 state 값으로.
  const [checklist, setChecklist] = useState<string[]>([]);
  const [changeTargetAlertShow, setChangeTargetAlertShow] = useState(false);

  // etc
  // fn
  const goToOrderHistoryDetail = () => {
    navigate('OrderHistoryDetail', {
      orderDetailData: order,
      totalPrice: order[0][0].orderPrice,
    });
  };
  const onListBoxPressed = async ({
    orderNo,
    menuNoAndQtyIdx,
  }: {
    orderNo: string;
    menuNoAndQtyIdx: string;
  }) => {
    setChecklist(prev => {
      const newCheckList = prev.includes(menuNoAndQtyIdx)
        ? prev.filter(v => v !== menuNoAndQtyIdx)
        : [...prev, menuNoAndQtyIdx];
      updateTotalCheckList({orderNo, menuNoAndQtyIdx}); // asyncStorage update
      return newCheckList;
    });
  };
  // percentage
  const numerator = checklist.length || 0;
  const denominator = order.length;
  const percentage = Math.round((numerator / denominator) * 100);

  // useEffect
  useEffect(() => {
    if (!order) return;
    setOptions({
      headerTitle: `${parseDate(order[0][0].buyDate)} 주문`,
    });
  }, []);
  // asyncStorage checklist data
  useEffect(() => {
    initialChecklist && setChecklist(initialChecklist);
  }, [initialChecklist]);

  // 몸무게, 목표 변경 알럿
  useEffect(() => {
    if (percentage !== 100) return;
    percentage === 100 && setChangeTargetAlertShow(true);
  }, [checklist]);
  return (
    <Container style={{backgroundColor: colors.backgroundLight2}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 64}}
        showsVerticalScrollIndicator={false}>
        <Card>
          <Row style={{alignSelf: 'center'}}>
            <CardTitle>
              끼니 ({numerator}/{denominator})
            </CardTitle>
            {/* 파이그래프 */}
            {percentage === 100 ? (
              <Icon
                style={{marginLeft: 8, zIndex: 2}}
                source={icons.checkRoundCheckedPurple_24}
              />
            ) : (
              <Col
                style={{
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                }}>
                <PieChart
                  series={[numerator, denominator - numerator]}
                  widthAndHeight={20}
                  style={{zIndex: 2}}
                  sliceColor={[colors.main, colors.white]}
                  coverRadius={0.6}
                />
              </Col>
            )}
          </Row>
          <GoHistoryDetailBtn onPress={goToOrderHistoryDetail}>
            <TextGrey>주문전체정보</TextGrey>
            <Icon size={20} source={icons.arrowRight_20} />
          </GoHistoryDetailBtn>
          <HorizontalSpace height={16} />

          {/* 끼니 체크리스트 */}
          {order?.map((menu, idx) => {
            const orderNo = menu[0].orderNo;
            const menuNoAndQtyIdx = `${menu[0].dietNo}/${menu[0].qtyIdx}`;
            return (
              <Col key={idx}>
                <ShadowView style={{borderRadius: 5}}>
                  <CheckListBox
                    onPress={async () =>
                      onListBoxPressed({
                        orderNo,
                        menuNoAndQtyIdx,
                      })
                    }>
                    <LeftBar />
                    <CheckListTitle>
                      {menu[0].dietSeq}{' '}
                      {menu[0].qtyIdx > 0 && `(${menu[0].qtyIdx + 1})`}
                    </CheckListTitle>
                    <Icon
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: 24,
                        zIndex: 2,
                      }}
                      source={
                        checklist.includes(menuNoAndQtyIdx)
                          ? icons.checkRoundCheckedGreen_24
                          : icons.checkRoundEmpty_24
                      }
                    />
                    <HorizontalSpace height={16} />
                    <FoodList menu={menu} />
                    {checklist.includes(menuNoAndQtyIdx) && <OpacityView />}
                  </CheckListBox>
                </ShadowView>
                {order.length - 1 !== idx && (
                  <HorizontalSpace style={{height: 24}} />
                )}
              </Col>
            );
          })}
        </Card>
      </ScrollView>
      <DAlert
        alertShow={changeTargetAlertShow}
        confirmLabel="목표변경"
        renderContent={() => (
          <CommonAlertContent
            text={'식단을 완료했어요\n체형이나 체중변화가 있었나요?'}
            subText={'더 정확한 식단을 위해\n목표칼로리를 재설정해주세요'}
          />
        )}
        onConfirm={() =>
          reset({
            index: 0,
            routes: [
              {name: 'BottomTabNav', params: {screen: 'NewHome'}},
              {name: 'UserInput', params: {from: 'Checklist'}},
            ],
          })
        }
        NoOfBtn={2}
        onCancel={() => setChangeTargetAlertShow(false)}
        style={{width: 280}}
      />
    </Container>
  );
};

export default Checklist;

const Card = styled(ShadowView)`
  background-color: ${colors.white};
  border-radius: 10px;
  padding: 24px 16px 32px 16px;
  margin-top: 40px;
`;

const CardTitle = styled(TextMain)`
  font-size: 14px;
  line-height: 18px;
`;

const TextGrey = styled(TextSub)`
  font-size: 12px;
  line-height: 16px;
`;

const GoHistoryDetailBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  margin-top: 24px;
`;

const CheckListBox = styled.TouchableOpacity`
  background-color: ${colors.white};
  width: 100%;
  border-radius: 5px;
  padding: 24px 16px 32px 16px;
`;

const LeftBar = styled.View<{screen?: 'Home' | 'Diet' | string}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background-color: ${colors.inactivated};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const CheckListTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
`;

const OpacityView = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${colors.whiteOpacity70};
  z-index: 1;
`;
