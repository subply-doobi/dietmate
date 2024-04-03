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

const Age = ({userInputState}: {userInputState: IUserInputState}) => {
  // redux
  const dispatch = useDispatch();
  const {age} = userInputState;
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
      />
    </Container>
  );
};

export default Age;

const Container = styled.View`
  flex: 1;
`;
