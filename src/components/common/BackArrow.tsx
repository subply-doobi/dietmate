import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

const Back = styled.Image`
  margin-left: 16px;
  width: 24px;
  height: 24px;
`;

const BackArrow = ({goBackFn}: {goBackFn: Function}) => {
  return (
    <TouchableOpacity onPress={() => goBackFn()}>
      <Back source={require('../../assets/icons/24_back.png')} />
    </TouchableOpacity>
  );
};

export default BackArrow;
