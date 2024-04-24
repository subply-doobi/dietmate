// 3rd
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../app/store/reduxStore';
import styled from 'styled-components/native';

// doobi
import SquareInput from '../../../../shared/ui/SquareInput';
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';
import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native';

const Age = ({userInputState}: {userInputState: IUserInputState}) => {
  // navigation
  const {isFocused} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {age} = userInputState;

  // useRef
  const ageRef = useRef<TextInput | null>(null);

  // useEffect
  useEffect(() => {
    if (isFocused()) {
      ageRef?.current?.focus();
    }
  }, [isFocused()]);

  return (
    <Container>
      <SquareInput
        label="만 나이"
        isActive={!!age.value}
        value={age.value}
        onChangeText={v => dispatch(setValue({name: 'age', value: v}))}
        errMsg={age.errMsg}
        keyboardType="numeric"
        maxLength={3}
        placeholder="만 나이를 입력해주세요"
        ref={ageRef}
      />
    </Container>
  );
};

export default Age;

const Container = styled.View`
  flex: 1;
`;
