// 3rd
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../app/store/reduxStore';

// doobi
import {Col} from '../../../../shared/ui/styledComps';
import SquareInput from '../../../../shared/ui/SquareInput';
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';
import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native';

const Height = ({userInputState}: {userInputState: IUserInputState}) => {
  // navigation
  const {isFocused} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {height} = userInputState;

  // useRef
  const heightRef = useRef<TextInput | null>(null);

  // useEffect
  useEffect(() => {
    if (isFocused()) {
      heightRef?.current?.focus();
    }
  }, [isFocused()]);

  return (
    <Container>
      <SquareInput
        label="신장 (cm)"
        isActive={!!height.value}
        value={height.value}
        onChangeText={v => dispatch(setValue({name: 'height', value: v}))}
        errMsg={height.errMsg}
        keyboardType="numeric"
        maxLength={3}
        placeholder="신장을 입력해주세요"
        ref={heightRef}
      />
    </Container>
  );
};

export default Height;

const Container = styled.View`
  flex: 1;
`;
