import styled from 'styled-components/native';
import {UserInfoTextInput} from '../../../shared/ui/styledComps';
import React, {forwardRef} from 'react';
import {TextInput} from 'react-native';
import colors from '../../../shared/colors';

interface IDTextInput extends React.ComponentProps<typeof TextInput> {
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

const Input = styled(UserInfoTextInput)``;
