import {View, Text} from 'react-native';
import React, {SetStateAction, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';
import styled from 'styled-components/native';
import DDropdown from '../../../shared/ui/DDropdown';
import {HorizontalSpace} from '../../../shared/ui/styledComps';

const Company = ({
  wantedCompany,
  setWantedCompany,
}: {
  wantedCompany: string;
  setWantedCompany: React.Dispatch<SetStateAction<string>>;
}) => {
  // redux
  const {platformDDItems} = useSelector((state: RootState) => state.common);
  return (
    <Box>
      <HorizontalSpace height={64} />
      <DDropdown
        placeholder="식품사"
        value={wantedCompany}
        setValue={setWantedCompany}
        items={platformDDItems}
      />
    </Box>
  );
};

export default Company;

const Box = styled.View``;
