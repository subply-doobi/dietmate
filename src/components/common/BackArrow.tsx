import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

const Back = styled.Image`
  width: 24px;
  height: 24px;
`;

const BackArrow = ({
  goBackFn,
  style,
}: {
  goBackFn: Function;
  style?: {marginLeft?: number};
}) => {
  return (
    <TouchableOpacity onPress={() => goBackFn()} style={{...style}}>
      <Back source={require('../../assets/icons/24_back.png')} />
    </TouchableOpacity>
  );
};

export default BackArrow;
