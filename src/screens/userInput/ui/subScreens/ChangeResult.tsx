import styled from 'styled-components/native';
import {IUserInputState} from '../../../../features/reduxSlices/userInputSlice';
import {useGetBaseLine} from '../../../../shared/api/queries/baseLine';
import {useMemo} from 'react';
import colors from '../../../../shared/colors';
import {
  Col,
  Icon,
  Row,
  TextMain,
  TextSub,
} from '../../../../shared/ui/styledComps';
import {icons} from '../../../../shared/iconSource';

const ChangeResult = ({userInputState}: {userInputState: IUserInputState}) => {
  // react-query
  const {data: baseLineData} = useGetBaseLine();

  // userInput state
  const {weight, calorie, carb, protein, fat} = userInputState;

  const changeContent = useMemo(() => {
    if (!baseLineData) return [];

    const weightDiff = Math.round(
      parseInt(baseLineData.weight) - parseInt(weight.value),
    );
    const calorieDiff = Math.round(
      parseInt(baseLineData.calorie) - parseInt(calorie.value),
    );
    const carbDiff = Math.round(
      parseInt(baseLineData.carb) - parseInt(carb.value),
    );
    const proteinDiff = Math.round(
      parseInt(baseLineData.protein) - parseInt(protein.value),
    );
    const fatDiff = Math.round(
      parseInt(baseLineData.fat) - parseInt(fat.value),
    );

    return [
      {
        title: '몸무게',
        prev: `${parseInt(baseLineData.weight)}kg`,
        curr: `${parseInt(weight.value)}kg`,
        diff:
          weightDiff < 0
            ? `(${weightDiff})`
            : weightDiff > 0
              ? `(+${Math.abs(weightDiff)})`
              : '',
        color: colors.black,
      },
      {
        title: '칼로리',
        prev: `${parseInt(baseLineData.calorie)}kcal`,
        curr: `${parseInt(calorie.value)}kcal`,
        diff:
          calorieDiff < 0
            ? `(${calorieDiff})`
            : calorieDiff > 0
              ? `(+${Math.abs(calorieDiff)})`
              : '',
        color: colors.main,
      },
      {
        title: '탄수화물',
        prev: `${parseInt(baseLineData.carb)}g`,
        curr: `${parseInt(carb.value)}g`,
        diff:
          carbDiff < 0
            ? `${carbDiff}`
            : carbDiff > 0
              ? `+${Math.abs(carbDiff)}`
              : '',
        color: colors.blue,
      },
      {
        title: '단백질',
        prev: `${parseInt(baseLineData.protein)}g`,
        curr: `${parseInt(protein.value)}g`,
        diff:
          proteinDiff < 0
            ? `${proteinDiff}`
            : proteinDiff > 0
              ? `+${Math.abs(proteinDiff)}`
              : '',
        color: colors.green,
      },
      {
        title: '지방',
        prev: `${parseInt(baseLineData.fat)}g`,
        curr: `${parseInt(fat.value)}g`,
        diff:
          fatDiff < 0
            ? `${fatDiff}`
            : fatDiff > 0
              ? `+${Math.abs(fatDiff)}`
              : '',
        color: colors.orange,
      },
    ];
  }, [baseLineData, userInputState]);

  return (
    <Container>
      {changeContent.map((item, idx) => (
        <Box key={item.title}>
          <Bar style={{backgroundColor: item.color}} />
          <Col style={{flex: 1.4, marginLeft: 16}}>
            <PrevValue>{item.title}</PrevValue>
            <PrevValue style={{marginTop: 2}}>{item.prev}</PrevValue>
          </Col>
          <Icon source={icons.arrowRight_20} />
          <Col style={{flex: 1, marginLeft: 16}}>
            <CurrValue>{item.curr} </CurrValue>
          </Col>
          <Col style={{flex: 1.2, marginLeft: 16}}>
            <CurrValue>{item.diff}</CurrValue>
          </Col>
        </Box>
      ))}
    </Container>
  );
};

export default ChangeResult;
const Container = styled.View`
  flex: 1;
  row-gap: 12px;
`;
const Box = styled.View`
  flex-direction: row;
  flex: 1;
  height: 58px;
  align-items: center;
`;

const Bar = styled.View`
  width: 6px;
  height: 58px;
  background-color: ${colors.black};
  position: absolute;
  left: 0;
  border-radius: 2px;
`;

const PrevValue = styled(TextSub)`
  font-size: 16px;
  line-height: 20px;
`;
const CurrValue = styled(TextMain)`
  font-size: 16px;
  line-height: 20px;
`;
