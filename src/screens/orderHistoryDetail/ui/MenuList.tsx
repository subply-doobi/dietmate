// RN

// 3rd
import styled from 'styled-components/native';

// doobi
import {IOrderedProduct} from '../../../shared/api/types/order';
import colors from '../../../shared/colors';
import {
  sumUpNutrients,
  commaToNum,
  sumUpPrice,
} from '../../../shared/utils/sumUp';
import {Row, Col, VerticalLine, TextMain} from '../../../shared/ui/styledComps';
import FoodList from './FoodList';

const NUTRIENT_TYPE = [
  {id: 'calorie', label: '칼로리'},
  {id: 'carb', label: '탄수화물'},
  {id: 'protein', label: '단백질'},
  {id: 'fat', label: '지방'},
];

const MenuList = ({
  orderDetailData,
}: {
  orderDetailData: Readonly<IOrderedProduct[][]>;
}) => {
  const isSelfOrder = orderDetailData[0][0]?.orderTypeCd === String('SP011001');
  return (
    <ContentContainer>
      {orderDetailData.map((menu: IOrderedProduct[], menuIdx: number) => {
        const {cal, carb, protein, fat} = sumUpNutrients(menu);
        return (
          <Card key={menuIdx}>
            {/* 카드제목 */}
            <CardTitle>
              끼니 {menuIdx + 1}{' '}
              <CardTitle style={{color: colors.textSub}}>
                (x{menu[0]?.qty}개)
              </CardTitle>
            </CardTitle>

            {/* 해당 끼니 영양성분 */}
            <MenuNutrContainer>
              {NUTRIENT_TYPE.map((nutrient, index) => (
                <Row key={index} style={{flex: 1, height: '100%'}}>
                  <Col style={{flex: 1, alignItems: 'center'}}>
                    <MenuNutr>{nutrient.label}</MenuNutr>
                    <MenuNutrValue>
                      {[cal, carb, protein, fat][index]}
                      {nutrient.id === 'calorie' ? ' kcal' : ' g'}
                    </MenuNutrValue>
                  </Col>
                  {NUTRIENT_TYPE.length - 1 !== index && <VerticalLine />}
                </Row>
              ))}
            </MenuNutrContainer>

            {/* 해당 끼니 식품들 */}
            <FoodList menu={menu} />

            {isSelfOrder ? (
              <SelfOrderTextBox>
                <SelfOrderText>직접 구매한 식단</SelfOrderText>
              </SelfOrderTextBox>
            ) : (
              <TotalPrice>{commaToNum(sumUpPrice(menu, true))}원</TotalPrice>
            )}
          </Card>
        );
      })}
    </ContentContainer>
  );
};

export default MenuList;

const ContentContainer = styled.View`
  flex: 1;
  padding: 0px 8px 24px 8px;
`;

const Card = styled.View`
  width: 100%;
  padding: 8px 8px 32px 8px;
  margin-top: 16px;
  background-color: ${colors.white};
  border-radius: 10px;
`;

const CardTitle = styled(TextMain)`
  margin-top: 16px;
  font-size: 18px;
  font-weight: bold;
  align-self: center;
`;

const MenuNutrContainer = styled(Row)`
  height: 40px;
  flex: 1;
  margin-top: 24px;
`;

const MenuNutr = styled(TextMain)`
  font-size: 12px;
`;

const MenuNutrValue = styled(TextMain)`
  font-size: 14px;
`;

const SelfOrderTextBox = styled.View`
  height: 24px;
  width: 100%;
  background-color: ${colors.backgroundLight2};

  justify-content: center;
  align-items: flex-end;

  margin-top: 8px;
  padding: 0px 8px 0px 0px;
`;

const SelfOrderText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const TotalPrice = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
  margin-top: 16px;
`;
