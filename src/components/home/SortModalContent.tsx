//RN, 3rd
import {useEffect, useState} from 'react';
import styled from 'styled-components/native';
//doobi util, redux, etc
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';
//doobi Component
import {
  Row,
  HorizontalLine,
  BtnCTA,
  HorizontalSpace,
} from '../../styles/styledConsts';
import DTooltip from '../common/DTooltip';

interface IProps {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  sortParam: string;
  setSortParam: (arg: string) => void;
}
interface IArg {
  price?: number;
  calorie?: number;
  protein?: number;
}
const SortModalContent = (props: IProps) => {
  // state
  const {closeModal, sortParam, setSortParam} = props;
  const [priceToggle, setPriceToggle] = useState(0);
  const [calorieToggle, setCalorieToggle] = useState(0);
  const [proteinToggle, setProteinToggle] = useState(0);
  const [param, setParam] = useState('');

  // tooltip
  const [priceCalCompareShow, setPriceCalCompareShow] = useState(false);
  const [priceProtCompareShow, setPriceProtCompareShow] = useState(false);
  // sortButton 상태 설정
  const toggleButton = (arg: IArg) => {
    const {price, calorie, protein} = arg;
    price === 0
      ? setParam('Price,DESC')
      : price === 1
      ? setParam('Price,ASC')
      : price === 2
      ? setParam('')
      : null;
    calorie === 0
      ? setParam('PriceCalorieCompare,DESC')
      : arg.calorie === 1
      ? setParam('PriceCalorieCompare,ASC')
      : arg.calorie === 2
      ? setParam('')
      : null;
    protein === 0
      ? setParam('PriceProteinCompare,DESC')
      : arg.protein === 1
      ? setParam('PriceProteinCompare,ASC')
      : arg.protein === 2
      ? setParam('')
      : null;
  };
  // sortButton 상태에 따른 이미지 변경
  const imageFunction = () => {
    switch (sortParam) {
      case 'Price,DESC':
        setPriceToggle(1);
        break;
      case 'Price,ASC':
        setPriceToggle(2);
        break;
      case 'PriceCalorieCompare,DESC':
        setCalorieToggle(1);
        break;
      case 'PriceCalorieCompare,ASC':
        setCalorieToggle(2);
        break;
      case 'PriceProteinCompare,DESC':
        setProteinToggle(1);
        break;
      case 'PriceProteinCompare,ASC':
        setProteinToggle(2);
        break;
      default:
        break;
    }
  };
  //useEffect
  useEffect(() => {
    imageFunction();
  }, []);
  return (
    <>
      <HorizontalSpace height={16} />
      <Button
        onPress={() => {
          setCalorieToggle(0);
          setProteinToggle(0);
          toggleButton({price: priceToggle});
          setPriceToggle(
            priceToggle % 2 === 0 && priceToggle !== 0 ? 0 : priceToggle + 1,
          );
        }}>
        <SortRow>
          <Text>가격</Text>
          {priceToggle === 0 ? (
            <Image source={icons.sort_24} />
          ) : priceToggle === 1 ? (
            <Image source={icons.sortDescending_24} />
          ) : (
            <Image source={icons.sortAscending_24} />
          )}
        </SortRow>
      </Button>
      <HorizontalLine />
      <Button
        onPress={() => {
          setPriceToggle(0);
          setProteinToggle(0);
          setCalorieToggle(
            calorieToggle % 2 === 0 && calorieToggle !== 0
              ? 0
              : calorieToggle + 1,
          );
          toggleButton({calorie: calorieToggle});
        }}>
        <SortRow>
          <Text>가칼비</Text>
          {calorieToggle === 0 ? (
            <Image source={icons.sort_24} />
          ) : calorieToggle === 1 ? (
            <Image source={icons.sortDescending_24} />
          ) : (
            <Image source={icons.sortAscending_24} />
          )}
        </SortRow>
        <TooltipBtn
          onPressIn={() => setPriceCalCompareShow(true)}
          onPressOut={() => setPriceCalCompareShow(false)}>
          <TooltipImage source={icons.question_24} />
        </TooltipBtn>
        <DTooltip
          tooltipShow={priceCalCompareShow}
          text={`가격대비 칼로리로 정렬합니다\n한국인은 효율!`}
          boxLeft={0}
          boxBottom={42}
          triangleLeft={12}
        />
      </Button>
      <HorizontalLine />

      <Button
        onPress={() => {
          setPriceToggle(0);
          setCalorieToggle(0);
          setProteinToggle(
            proteinToggle % 2 === 0 && proteinToggle !== 0
              ? 0
              : proteinToggle + 1,
          );
          toggleButton({protein: proteinToggle});
        }}>
        <SortRow>
          <Text>가단비</Text>
          {proteinToggle === 0 ? (
            <Image source={icons.sort_24} />
          ) : proteinToggle === 1 ? (
            <Image source={icons.sortDescending_24} />
          ) : (
            <Image source={icons.sortAscending_24} />
          )}
        </SortRow>
        <TooltipBtn
          onPressIn={() => setPriceProtCompareShow(true)}
          onPressOut={() => setPriceProtCompareShow(false)}>
          <TooltipImage source={icons.question_24} />
        </TooltipBtn>
        <DTooltip
          tooltipShow={priceProtCompareShow}
          text={`가격대비 단백질양으로 정렬합니다\n헬창판별버튼이라는 소문이...`}
          boxLeft={0}
          boxBottom={42}
          triangleLeft={12}
        />
      </Button>
      <BottomRow>
        <BtnCTA
          style={{
            flex: 1,
          }}
          btnStyle={'border'}
          onPress={() => {
            setParam('');
            setPriceToggle(0);
            setProteinToggle(0);
            setCalorieToggle(0);
          }}>
          <BottomText style={{color: colors.textSub}}>초기화</BottomText>
        </BtnCTA>
        <BtnCTA
          style={{
            flex: 1,
            marginLeft: 8,
          }}
          btnStyle={'activated'}
          onPress={() => {
            closeModal(false);
            setSortParam(param);
          }}>
          <BottomText>확인</BottomText>
        </BtnCTA>
      </BottomRow>
    </>
  );
};

export default SortModalContent;

const Text = styled.Text`
  font-size: 16px;
`;

const BottomText = styled.Text`
  font-size: 16px;
  color: ${colors.white};
`;
const Button = styled.TouchableOpacity`
  height: 58px;
  justify-content: center;
`;
const Image = styled.Image`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  align-self: center;
`;
const SortRow = styled(Row)`
  justify-content: center;
`;
const BottomRow = styled.View`
  margin-top: 16px;
  flex-direction: row;
  justify-content: center;
`;

const TooltipBtn = styled.Pressable`
  position: absolute;
  left: 0px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

const TooltipImage = styled.Image`
  width: 24px;
  height: 24px;
`;
