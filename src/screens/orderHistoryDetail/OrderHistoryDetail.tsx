// RN
import {useEffect, useState} from 'react';
import {Pressable, ScrollView, Text, TouchableOpacity} from 'react-native';

// 3rd
import styled from 'styled-components/native';

// doobi
import colors from '../../shared/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IOrderedProduct} from '../../shared/api/types/order';
import {TextMain, TextSub, HorizontalSpace} from '../../shared/ui/styledComps';
import DAccordionHeader from '../../shared/ui/DAccordionHeader';
import {getHistoryDetailAcContent} from './util/contents';
import Accordion from 'react-native-collapsible/Accordion';

// main component
const OrderHistoryDetail = () => {
  // navigation
  const route = useRoute();
  const navigation = useNavigation();
  const {
    orderDetailData, // 해당 날짜의 끼니별 주문식품
    totalPrice,
  }: {
    orderDetailData: Readonly<IOrderedProduct[][]>;
    totalPrice: Readonly<number>;
  } = route.params;

  // useState
  const [activeSection, setActiveSection] = useState<number[]>([]);

  // useEffect
  useEffect(() => {
    orderDetailData &&
      navigation.setOptions({
        title: orderDetailData[0][0]?.buyDate,
      });
  }, []);

  const acContent = getHistoryDetailAcContent(orderDetailData, totalPrice);

  return (
    <Container>
      <ScrollView>
        <HorizontalSpace height={40} />
        <Accordion
          sections={acContent}
          containerStyle={{rowGap: 24, paddingBottom: 64}}
          activeSections={activeSection}
          renderHeader={(content, index, isActive) => (
            <DAccordionHeader
              title={content.title}
              isActive={isActive}
              subTitle={content.subTitle}
              arrow={content.title === '주문식품'}
              customComponent={() => content.headerContent}
            />
          )}
          renderContent={(content, index, isActive) => content.content}
          onChange={a =>
            (a[0] === undefined || acContent[a[0]].title === '주문식품') &&
            setActiveSection(a)
          }
          touchableComponent={Pressable}
        />
      </ScrollView>
    </Container>
  );
};

export default OrderHistoryDetail;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundLight2};
`;

const SummaryTitle = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
  margin-top: 16px;
`;

const SummaryAddressText = styled(TextSub)`
  font-size: 14px;
  margin-top: 2px;
`;
const SummaryPMText = styled(TextSub)`
  font-size: 14px;
  margin-top: 2px;
`;
