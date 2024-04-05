// 3rd
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../app/store/reduxStore';
import styled from 'styled-components/native';

// doobi
import SquareInput from '../../../../shared/ui/SquareInput';
import {Col} from '../../../../shared/ui/styledComps';
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';

const Weight = ({userInputState}: {userInputState: IUserInputState}) => {
  // redux
  const dispatch = useDispatch();
  const {weight} = userInputState;
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
      />
    </Container>
  );
};

export default Weight;
const Container = styled.View`
  flex: 1;
`;
