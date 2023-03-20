import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import {icons} from '../../assets/icons/iconSource';

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
      <Back source={icons.back_24} />
    </TouchableOpacity>
  );
};

export default BackArrow;
