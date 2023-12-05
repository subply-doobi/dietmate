import {SafeAreaView} from 'react-native';

import {TextMain} from '../../styles/styledConsts';
import styled from 'styled-components/native';

const ShippingPart = () => {
  return (
    <SafeAreaView>
      <Desc>
        다이어트메이트는 여러 업체들의 식품들로 {`\n`}
        고객님이 구성한 식단을 {`\n`}한 번에 결제할 수 있도록 도와드립니다.
        {`\n`}
        {`\n`}
        <Desc style={{fontWeight: 'bold'}}>
          (배송완료까지 2~4 영업일 소요)
        </Desc>{' '}
        {`\n`}
        {`\n`}
        결제된 식품들은 해당 식품사에서 배송을 보내드리므로 {`\n`}각 식품사의
        배송정책이 적용됩니다. {`\n`}
        {`\n`}
        배송정책이 궁금하시다면 {`\n`}
        식품사의 공식 쇼핑몰을 방문해보세요
      </Desc>
    </SafeAreaView>
  );
};
export default ShippingPart;

const Desc = styled(TextMain)``;
