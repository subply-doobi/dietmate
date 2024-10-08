// RN
import {TextInput} from 'react-native';
import {useEffect, useRef} from 'react';

// 3rd
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';

// doobi
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';
import SquareInput from '../../../../shared/ui/SquareInput';
import {useGetBaseLine} from '../../../../shared/api/queries/baseLine';

const ChangeWeight = ({userInputState}: {userInputState: IUserInputState}) => {
  // react-qurey
  const {data: baseLineData} = useGetBaseLine();

  // navigation
  const {isFocused} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {weight} = userInputState;

  // useRef
  const weightRef = useRef<TextInput | null>(null);

  // useEffect
  useEffect(() => {
    if (isFocused()) {
      weightRef?.current?.focus();
    }
  }, [isFocused()]);

  return (
    <Container>
      <SquareInput
        label={`몸무게 (기존 : ${baseLineData?.weight}kg)`}
        isActive={!!weight.value}
        value={weight.value}
        onChangeText={v => dispatch(setValue({name: 'weight', value: v}))}
        errMsg={weight.errMsg}
        keyboardType="numeric"
        maxLength={3}
        placeholder="몸무게를 입력해주세요"
        ref={weightRef}
      />
    </Container>
  );
};

export default ChangeWeight;

const Container = styled.View`
  flex: 1;
`;
