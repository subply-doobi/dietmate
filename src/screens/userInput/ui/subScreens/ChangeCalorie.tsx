import styled from 'styled-components/native';
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';
import AdditionalGuide from '../AdditionalGuide';
import {icons} from '../../../../shared/iconSource';
import {useGetBaseLine} from '../../../../shared/api/queries/baseLine';
import SquareInput from '../../../../shared/ui/SquareInput';
import {useDispatch} from 'react-redux';
import {RefObject} from 'react';
import {ScrollView} from 'react-native';

interface IChangeCalorie {
  userInputState: IUserInputState;
  scrollRef: RefObject<ScrollView>;
}
const ChangeCalorie = ({userInputState, scrollRef}: IChangeCalorie) => {
  // redux
  const dispatch = useDispatch();

  // react-query
  const {data: baseLineData} = useGetBaseLine();

  // input state
  const {weight, calorie} = userInputState;
  const weightDiff = Number(baseLineData?.weight) - Number(weight.value);

  const weightText =
    Math.abs(weightDiff) < 1
      ? '이전과 몸무게가 비슷해요'
      : weightDiff > 0
        ? '이전보다 몸무게가 감소했어요'
        : '이전보다 몸무게가 증가했어요';

  const text = `${weightText}\n
목표와 다르게 진행되고 있다면
50~100 kcal 정도씩 변경해보세요`;

  return (
    <Container>
      <AdditionalGuide iconSource={icons.warning_24} text={text} />
      <SquareInput
        boxStyle={{marginTop: 40}}
        label={`한 끼 목표 칼로리 (기존 : ${baseLineData && parseInt(baseLineData.calorie)}kcal)`}
        isActive={!!calorie.value}
        value={calorie.value}
        onChangeText={v => dispatch(setValue({name: 'calorie', value: v}))}
        errMsg={calorie.errMsg}
        keyboardType="numeric"
        maxLength={4}
        placeholder={`한 끼 목표 칼로리 (기존 : ${baseLineData && parseInt(baseLineData.calorie)}kcal)`}
        onFocus={() =>
          setTimeout(() => {
            scrollRef?.current?.scrollToEnd({animated: true});
          }, 150)
        }
      />
    </Container>
  );
};

export default ChangeCalorie;

const Container = styled.View`
  flex: 1;
`;
