import React, {useEffect, useRef, useState} from 'react';
import {Alert, TextInput} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import {
  AccordionContentContainer,
  BtnCTA,
  Col,
  ErrorBox,
  ErrorText,
  HorizontalLine,
  Input,
  InputHeader,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import {ENTRANCE_TYPE} from '../../constants/constants';
import {useListAddress} from '../../query/queries/address';
import {loadAddressData, setValue} from '../../stores/slices/userInputSlice';
import {setselectedAddrIdx} from '../../stores/slices/orderSlice';
import {IAddressData} from '../../query/types/address';

const EntranceMethodContainer = () => {
  // redux
  const dispatch = useDispatch();
  const {entranceType, entranceNote} = useSelector(
    (state: RootState) => state.userInput,
  );

  return (
    <>
      <ContentTitle style={{marginTop: 30}}>공동현관 출입</ContentTitle>
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
      <Input
        placeholder={'예) 3847*'}
        value={entranceNote.value}
        onChangeText={v => dispatch(setValue({name: 'entranceNote', value: v}))}
        isActivated={!!entranceNote.value}
        keyboardType="default"
      />
    </>
  );
};

const Address = () => {
  // redux
  const dispatch = useDispatch();
  const {selectedAddrIdx} = useSelector((state: RootState) => state.order);
  const {buyerName, buyerTel, receiver, receiverContact} = useSelector(
    (state: RootState) => state.userInput,
  );

  // react-query
  const {data: listAddressData} = useListAddress();

  // useState
  const [isSameInfo, setIsSameInfo] = useState(false);

  // navigation
  const {navigate} = useNavigation();

  // useRef (받는 분 -> 휴대폰 focus)
  const receiverContactRef = useRef<TextInput>(null);

  // etc
  // 주문자 정보와 동일 체크박스 action
  const onIsSameCheckPress = () => {
    dispatch(
      setValue({
        name: 'receiver',
        value: isSameInfo ? '' : buyerName.value,
      }),
    );
    dispatch(
      setValue({
        name: 'receiverContact',
        value: isSameInfo ? '' : buyerTel.value,
      }),
    );
    setIsSameInfo(v => !v);
  };

  // 배송지 수정 버튼 action
  const onAddrEditPress = (ads: IAddressData) => {
    dispatch(
      loadAddressData({
        addr1: ads.addr1,
        addr2: ads.addr2,
        zipCode: ads.zipCode,
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

      {/* 받는 분 정보 입력 부분 */}
      <Row style={{justifyContent: 'space-between', marginTop: 32}}>
        <ContentTitle>받는 분 정보</ContentTitle>
        <Row>
          <GuideText>주문자 정보와 동일</GuideText>
          <Checkbox onPress={() => onIsSameCheckPress()}>
            <CheckIcon
              source={
                isSameInfo ? icons.checkboxCheckedPurple_24 : icons.checkbox_24
              }
            />
          </Checkbox>
        </Row>
      </Row>

      {/* receiver */}
      <InputHeader isActivated={!!receiver.value}>받는 분</InputHeader>
      <Input
        placeholder={'받는 분'}
        value={receiver.value}
        onChangeText={v => dispatch(setValue({name: 'receiver', value: v}))}
        isActivated={!!receiver.value}
        keyboardType="default"
        onSubmitEditing={() => {
          receiverContactRef?.current?.focus();
        }}
      />
      {receiver.errMsg && (
        <ErrorBox>
          <ErrorText>{receiver.errMsg}</ErrorText>
        </ErrorBox>
      )}

      {/* receiverContact */}
      <InputHeader isActivated={!!receiverContact.value}>휴대폰</InputHeader>
      <Input
        placeholder={'휴대폰'}
        value={receiverContact.value}
        onChangeText={v =>
          dispatch(setValue({name: 'receiverContact', value: v}))
        }
        isActivated={!!receiverContact.value}
        keyboardType="numeric"
        maxLength={13}
        ref={receiverContactRef}
      />
      {receiverContact.errMsg && (
        <ErrorBox>
          <ErrorText>{receiverContact.errMsg}</ErrorText>
        </ErrorBox>
      )}

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
const GuideText = styled(TextMain)`
  font-size: 16px;
`;
const EntranceCheckBoxText = styled(TextMain)`
  font-size: 14px;
`;
const EntranceCheckBox = styled.TouchableOpacity``;
const Checkbox = styled.TouchableOpacity`
  margin-left: 8px;
`;
const EntranceRow = styled(Row)`
  margin-top: 28px;
`;
