import styled from 'styled-components/native';
import {View} from 'react-native';

import {HorizontalLine} from '../../../styles/styledConsts';
import colors from '../../../styles/colors';

import {useCountCategory} from '../../../query/queries/category';

interface IProps {
  setCategoryParam: React.Dispatch;
  categoryParam: string;
}
const CategoryContent = (props: IProps) => {
  const {setCategoryParam, categoryParam} = props;
  const count = useCountCategory();
  console.log(categoryParam);
  const Contents = () => {
    return (
      <View style={{marginTop: 16}}>
        {count.data?.map((e, i) => (
          <View key={e.categoryCd}>
            <CategoryButton
              onPress={() => {
                setCategoryParam(e.categoryCd);
              }}>
              <CategoryText id={e.categoryCd} clicked={categoryParam}>
                {e.categoryCdNm}( {e.productCnt})
              </CategoryText>
            </CategoryButton>
            {i === 5 ? <></> : <HorizontalLine />}
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
color: ${({id, clicked}) => (id === clicked ? colors.main : colors.textSub)}
text-align: center;
`;
const CategoryButton = styled.TouchableOpacity`
  height: 58px;
  justify-content: center;
`;

const MODAL_WIDTH = 328;
