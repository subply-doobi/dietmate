import styled from 'styled-components/native';
import React, {forwardRef} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import colors from '../colors';

interface IDTextInput extends TextInputProps {
  isActivated: boolean;
  isValid: boolean;
}
const DTextInput = forwardRef((props: IDTextInput, ref) => {
  return (
    <Input
      {...props}
      placeholderTextColor={colors.textSub}
      ref={ref}
      style={{
        includeFontPadding: false,
        fontFamily: 'NotoSansKR',
      }}
    />
  );
});

export default DTextInput;

const Input = styled.TextInput<{
  isValid?: boolean;
  isActivated?: boolean;
}>`
  height: 40px;
  justify-content: center;
  align-items: flex-start;
  font-size: 16px;
  color: ${({isValid}) => (isValid ? colors.textMain : colors.warning)};

  line-height: 24px;

  border-bottom-width: 1px;
  border-color: ${({isActivated}) =>
    isActivated ? colors.main : colors.inactivated};
  padding-bottom: 8px;
`;
