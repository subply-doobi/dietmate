// 3rd
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';

// doobi
import SquareInput from '../../../../shared/ui/SquareInput';
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';
import {useNavigation} from '@react-navigation/native';
import {useRef, useEffect} from 'react';
import {TextInput} from 'react-native';

const Weight = ({userInputState}: {userInputState: IUserInputState}) => {
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
        label="몸무게 (kg)"
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

export default Weight;
const Container = styled.View`
  flex: 1;
`;
