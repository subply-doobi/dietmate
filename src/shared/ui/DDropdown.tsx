import React, {SetStateAction, useState} from 'react';
import styled from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';

import colors from '../../shared/colors';
import {InputHeaderText} from '../../shared/ui/styledComps';

interface CategoryObject {
  label: string;
  value: string;
}
interface IDDropdown {
  placeholder: string;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  items: Array<CategoryObject> | undefined;
  scrollRef?: any;
}

const DDropdown = (props: IDDropdown) => {
  const [open, setOpen] = useState(false);
  const {placeholder, value, setValue, items, scrollRef} = props;

  return (
    <>
      <DropdownHeader isActivated={true}>{placeholder}</DropdownHeader>
      <DropDownPicker
        style={{
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: colors.inactivated,
        }}
        dropDownContainerStyle={{
          position: 'relative',
          marginTop: -42,
          marginBottom: 40,
          paddingBottom: 4,
          borderRadius: 0,
          borderWidth: 1,
          borderTopWidth: 0,
          borderBottomWidth: 1,
          elevation: 3,
          borderColor: colors.inactivated,
          zIndex: 6000,
        }}
        selectedItemContainerStyle={{
          backgroundColor: colors.highlight,
        }}
        textStyle={{
          fontSize: 16,
          fontWeight: 'normal',
          color: colors.textMain,
        }}
        showTickIcon={false}
        open={open}
        setOpen={() => {
          scrollRef && !open && scrollRef.current.scrollToEnd();
          setOpen(open => !open);
        }}
        value={value}
        setValue={v => setValue(v)}
        items={items || []}
        //   onChangeValue={() => {}}
        listMode="SCROLLVIEW"
        dropDownDirection="BOTTOM"
      />
    </>
  );
};

export default DDropdown;

const DropdownHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
