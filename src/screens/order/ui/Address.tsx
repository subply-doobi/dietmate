import React, {useEffect, useRef, useState} from 'react';
import {Alert, TextInput} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {RootState} from '../../../app/store/reduxStore';
import {icons} from '../../../shared/iconSource';
import {
  AccordionContentContainer,
  BtnCTA,
  Col,
  ErrorBox,
  ErrorText,
  HorizontalLine,
  InputHeader,
  Row,
  TextMain,
  TextSub,
} from '../../../shared/ui/styledConsts';
import {ENTRANCE_TYPE} from '../../../shared/constants';
import {useListAddress} from '../../../shared/api/queries/address';
import {
  loadAddressData,
  setValue,
} from '../../../features/reduxSlices/userInputSlice';
import {setselectedAddrIdx} from '../../../features/reduxSlices/orderSlice';
import {IAddressData} from '../../../shared/api/types/address';
import DTextInput from '../../../components/common/textInput/DTextInput';

const EntranceMethodContainer = () => {
  // redux
  const dispatch = useDispatch();
  const {entranceType, entranceNote} = useSelector(
    (state: RootState) => state.userInput,
  );

  return (
    <>
      <ContentTitle style={{marginTop: 64}}>배송 참고사항</ContentTitle>
      <Col style={{marginTop: 30}} />
      {ENTRANCE_TYPE.map((e, i) => {
        return (
          <Row key={i} style={{marginBottom: 28}}>
            <EntranceCheckBox
              onPress={() =>
                dispatch(setValue({name: 'entranceType', value: e}))
              }>
              <CheckIcon
                source={
                  entranceType.value === e
                    ? icons.checkboxCheckedPurple_24
                    : icons.checkbox_24
                }
                style={{marginRight: 10}}
              />
            </EntranceCheckBox>
            <EntranceCheckBoxText>{e}</EntranceCheckBoxText>
          </Row>
        );
      })}

      <InputHeader isActivated={!!entranceNote.value}>
        배송 참고사항
      </InputHeader>
      <DTextInput
        placeholder={'예) 3847*'}
        value={entranceNote.value}
        onChangeText={v => dispatch(setValue({name: 'entranceNote', value: v}))}
        isActivated={!!entranceNote.value}
        isValid={entranceNote.isValid}
        keyboardType="default"
      />
    </>
  );
};

const Address = () => {
  // redux
  const dispatch = useDispatch();
  const {selectedAddrIdx} = useSelector((state: RootState) => state.order);

  // react-query
  const {data: listAddressData} = useListAddress();

  // navigation
  const {navigate} = useNavigation();

  // 배송지 수정 버튼 action
  const onAddrEditPress = (ads: IAddressData) => {
    dispatch(
      loadAddressData({
        addr1: ads.addr1 || '',
        addr2: ads.addr2 || '',
        zipCode: ads.zipCode || '',
      }),
    );
    navigate('AddressEdit', {
      addrNo: ads.addrNo,
      addr1: ads.addr1,
      addr2: ads.addr2,
      zipCode: ads.zipCode,
    });
  };

  // 배송지 추가 버튼 action
  const onAddrAddPress = () => {
    if (listAddressData && listAddressData?.length >= 5) {
      Alert.alert('주소는 5개 까지만 추가 가능합니다');
      return;
    }
    dispatch(
      loadAddressData({
        addr1: '',
        addr2: '',
        zipCode: '',
      }),
    );
    navigate('AddressEdit', {currentAddrLength: listAddressData?.length});
  };

  return (
    <AccordionContentContainer>
      {/* 각 주소 리스트 */}
      {listAddressData?.map((ads, index: number) => (
        <Col style={{width: '100%'}} key={index}>
          <AddressBox>
            <SelectContainer
              onPress={() => {
                dispatch(setselectedAddrIdx(index));
              }}>
              <CheckIcon
                source={
                  selectedAddrIdx === index
                    ? icons.checkboxCheckedPurple_24
                    : icons.checkbox_24
                }
              />
              <Col>
                <AddressBase>{ads.addr1}</AddressBase>
                <AddressDetail>{ads.addr2}</AddressDetail>
              </Col>
            </SelectContainer>

            {/* 배송지 수정 버튼 */}
            <EditBtn onPress={() => onAddrEditPress(ads)}>
              <EditIcon source={icons.edit_24} />
            </EditBtn>
          </AddressBox>
          <HorizontalLine style={{marginTop: 16}} />
        </Col>
      ))}

      {/* 배송지 추가 버튼 */}
      <AddressAddBtn
        btnStyle={listAddressData?.length === 0 ? 'borderActivated' : 'border'}
        onPress={() => onAddrAddPress()}>
        <Row>
          <PlusSquareIcon
            source={
              listAddressData?.length === 0
                ? icons.plusSquareActivated_24
                : icons.plusSquare_24
            }
          />
          <AddressAddBtnText>배송지 추가</AddressAddBtnText>
        </Row>
      </AddressAddBtn>

      {/* 현관 출입방법 */}
      <EntranceMethodContainer />
    </AccordionContentContainer>
  );
};

export default Address;

const AddressBox = styled.View`
  flex-direction: row;
  width: 100%;
  height: 58px;
  padding-top: 24px;
`;

const SelectContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const AddressBase = styled(TextSub)`
  font-size: 14px;
  margin-left: 8px;
`;
const AddressDetail = styled(TextMain)`
  font-size: 16px;
  margin-left: 8px;
  margin-top: 2px;
`;

const EditBtn = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const CheckIcon = styled.Image`
  width: 24px;
  height: 24px;
`;
const EditIcon = styled.Image`
  width: 24px;
  height: 24px;
`;
const PlusSquareIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const AddressAddBtn = styled(BtnCTA)`
  height: 48px;
  margin-top: 16px;
`;
const AddressAddBtnText = styled(TextSub)`
  font-size: 14px;
  margin-left: 8px;
`;

const ContentTitle = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const EntranceCheckBoxText = styled(TextMain)`
  font-size: 14px;
`;
const EntranceCheckBox = styled.TouchableOpacity``;
