// RN
import {ActivityIndicator} from 'react-native';

// 3rd
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';

// doobi
import {
  HorizontalSpace,
  TextMain,
  TextSub,
} from '../../../shared/ui/styledComps';
import {useListDiet} from '../../../shared/api/queries/diet';
import MenuNumSelect from '../../../components/cart/MenuNumSelect';
import colors from '../../../shared/colors';

interface ICreateDietAlert {
  numOfCreateDiet: number;
  setNumOfCreateDiet: React.Dispatch<React.SetStateAction<number>>;
  isCreating: boolean;
}
const CreateDietAlert = ({
  numOfCreateDiet,
  setNumOfCreateDiet,
  isCreating,
}: ICreateDietAlert) => {
  // react-query
  const {data: dietData} = useListDiet();
  const desc = `총 5개 끼니를 구성하는 것을 추천해요 \n${dietData?.length !== 0 ? `(현재 ${dietData?.length}개의 끼니가 있어요)` : ''}`;
  if (isCreating)
    return (
      <Container>
        <ActivityIndicator size="small" color={colors.main} />
      </Container>
    );

  return (
    <Container>
      <Title>{'추가할 끼니 수량을\n선택해주세요'}</Title>
      <Desc>{desc}</Desc>
      <HorizontalSpace height={24} />
      <MenuNumSelect
        action="setQty"
        currentQty={numOfCreateDiet}
        setQty={setNumOfCreateDiet}
        maxQty={10}
      />
    </Container>
  );
};

export default CreateDietAlert;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  padding: 28px 0px;
`;

const Title = styled(TextMain)`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

const Desc = styled(TextSub)`
  font-size: 12px;
  line-height: 16px;
  margin-top: 16px;
  text-align: center;
`;
