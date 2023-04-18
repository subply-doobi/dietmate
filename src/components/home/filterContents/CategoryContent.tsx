import styled from 'styled-components/native';
import {View} from 'react-native';

import {HorizontalLine} from '../../../styles/StyledConsts';
import colors from '../../../styles/colors';

import {useCountCategory} from '../../../query/queries/category';
import {useSelector} from 'react-redux';
import {RootState} from '../../../stores/store';

interface IProps {
  setCategoryParam: React.Dispatch<React.SetStateAction<string>>;
  categoryParam: string;
}
const CategoryContent = (props: IProps) => {
  // redux
  const {totalFoodList} = useSelector((state: RootState) => state.cart);
  const {setCategoryParam, categoryParam} = props;
  const count = useCountCategory();
  const Contents = () => {
    return (
      <View style={{marginTop: 16}}>
        <CategoryButton
          onPress={() => {
            setCategoryParam('');
          }}>
          <CategoryText id={''} clicked={categoryParam}>
            전체 ({totalFoodList.length})
          </CategoryText>
        </CategoryButton>
        {count.data?.map((e, i) => (
          <View key={e.categoryCd}>
            <HorizontalLine />
            <CategoryButton
              onPress={() => {
                setCategoryParam(e.categoryCd);
              }}>
              <CategoryText id={e.categoryCd} clicked={categoryParam}>
                {e.categoryCdNm}( {e.productCnt})
              </CategoryText>
            </CategoryButton>
          </View>
        ))}
      </View>
    );
  };
  return (
    <>
      <Contents />
    </>
  );
};

export default CategoryContent;

const CategoryText = styled.Text`
  font-size: 16px;
  color: ${({id, clicked}) => (id === clicked ? colors.main : colors.textSub)};
  text-align: center;
`;
const CategoryButton = styled.TouchableOpacity`
  height: 58px;
  justify-content: center;
`;
