import React from 'react';
import styled from 'styled-components/native';
import {BusinessInfo} from '../../../constants/constants';
import colors from '../../../styles/colors';
import {TextSub} from '../../../styles/styledConsts';

const BusinessInfoContents = () => {
  return (
    <Container>
      <ContentsText>
        {BusinessInfo.name}
        {'\n'}
        {'\n'}
        대표자: {BusinessInfo.representative}
        {'\n'}
        사업자등록번호: {BusinessInfo.businessNumber}
        {'\n'}
        주소: {BusinessInfo.address}
      </ContentsText>
    </Container>
  );
};

export default BusinessInfoContents;

const Container = styled.View`
  flex: 1;
`;
const ContentsText = styled(TextSub)`
  font-size: 11px;
  color: ${colors.textSub};
  margin-left: 16px;
  margin-top: 8px;
`;
