import React, {useRef, useState} from 'react';
import {Alert, TextInput} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Controller, useWatch} from 'react-hook-form';

import {RootState} from '../../stores/store';
import {
  setOrderer,
  setReceiver,
  setSelectedAddressId,
} from '../../stores/slices/orderSlice';
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
} from '../../styles/StyledConsts';
import {IFormField, validationRules} from '../../constants/constants';
import {useListAddress, useGetAddress} from '../../query/queries/address';

interface IAddress {
  control: any;
  handleSubmit: any;
  errors: any;
  setValue: any;
}

const Address = ({
  control,
  handleSubmit,
  errors,
  setValue: setReceiverValue,
}: IAddress) => {
  // redux
  const dispatch = useDispatch();
  const {orderInfo, selectedAddressId} = useSelector(
    (state: RootState) => state.order,
  );
  // 렌더링이 6번되는데....
  const {data: listAddressData} = useListAddress();
  // navigation
  const navigation = useNavigation();
  // useRef (받는 분 -> 휴대폰 focus)
  const receiverContactRef = useRef<TextInput>(null);

  // checkbox 주문자정보와 동일
  const [isChecked, setIsChecked] = useState(false);

  // react-hook-form 주문자정보와 동일 체크한 경우 필요
  // + 페이지 이동 전에 Order 스크린에서 default값 남겨주기 위해 필요
  const ordererValue = useWatch({control, name: 'orderer'});
  const ordererContactValue = useWatch({control, name: 'ordererContact'});
  const receiverValue = useWatch({control, name: 'receiver'});
  const receiverContactValue = useWatch({control, name: 'receiverContact'});

  const renderReceiverInput = ({field: {onChange, value}}: IFormField) => {
    return (
      <>
        <InputHeader isActivated={value ? true : false}>받는 분</InputHeader>
        <Input
          placeholder={'받는 분'}
          value={value}
          onChangeText={onChange}
          isActivated={value ? true : false}
          keyboardType="default"
          onSubmitEditing={() => {
            receiverContactRef?.current?.focus();
          }}
        />
      </>
    );
  };
  const renderReceiverContactInput = ({
    field: {onChange, value},
  }: IFormField) => {
    return (
      <>
        <InputHeader isActivated={value ? true : false}>휴대폰</InputHeader>
        <Input
          placeholder={'휴대폰'}
          value={value}
          onChangeText={onChange}
          isActivated={value ? true : false}
          keyboardType="numeric"
          ref={receiverContactRef}
        />
      </>
    );
  };

  return (
    <AccordionContentContainer>
      {listAddressData?.map((ads, index: number) => (
        <Col style={{width: '100%'}} key={index}>
          <AddressBox>
            <SelectContainer
              onPress={() => {
                console.log('onPress: index: ', index);
                dispatch(setSelectedAddressId(index));
              }}>
              <CheckIcon
                source={
                  selectedAddressId === index
                    ? icons.checkboxCheckedPurple_24
                    : icons.checkbox_24
                }
              />
              <Col>
                <AddressBase>{ads.addr1}</AddressBase>
                <AddressDetail>{ads.addr2}</AddressDetail>
              </Col>
            </SelectContainer>
            <EditBtn
              onPress={() => {
                navigation.navigate('AddressEdit', {
                  currentAddressId: index,
                });
              }}>
              <EditIcon source={icons.edit_24} />
            </EditBtn>
          </AddressBox>
          <HorizontalLine style={{marginTop: 16}} />
        </Col>
      ))}
      <AddressAddBtn
        btnStyle={listAddressData?.length === 0 ? 'borderActivated' : 'border'}
        onPress={() => {
          // TBD | 5개 넘으면 안된다 안내 팝업
          if (listAddressData?.length >= 5) {
            Alert.alert('주소는 5개 까지만 추가 가능합니다');
            return;
          }
          // 배송지 추가할 때 페이지 변경되기 때문에
          // 주문자, 수령인 정보 남아있으려면 페이지 이동 전에 리덕스에 저장해줘야함
          dispatch(
            setOrderer({
              orderer: ordererValue,
              ordererContact: ordererContactValue,
            }),
          );
          dispatch(
            setReceiver({
              receiver: receiverValue,
              receiverContact: receiverContactValue,
            }),
          );
          navigation.navigate('AddressEdit');
        }}>
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
      <Row style={{justifyContent: 'space-between', marginTop: 32}}>
        <ContentTitle>받는 분 정보</ContentTitle>
        <Row>
          <GuideText>주문자 정보와 동일</GuideText>
          <Checkbox
            onPress={() => {
              if (!isChecked) {
                setReceiverValue('receiver', ordererValue);
                setReceiverValue('receiverContact', ordererContactValue);
              } else {
                setReceiverValue('receiver', '');
                setReceiverValue('receiverContact', '');
              }
              setIsChecked(v => !v);
              handleSubmit(() => {})();
            }}>
            <CheckIcon
              source={
                isChecked ? icons.checkboxCheckedPurple_24 : icons.checkbox_24
              }
            />
          </Checkbox>
        </Row>
      </Row>
      {/* receiver */}
      <Controller
        control={control}
        rules={validationRules.receiver}
        render={field => renderReceiverInput(field)}
        name="receiver"
      />
      {errors.receiver && (
        <ErrorBox>
          <ErrorText>{errors.receiver.message}</ErrorText>
        </ErrorBox>
      )}
      {/* receiverContact */}
      <Controller
        control={control}
        rules={validationRules.receiverContact}
        render={field => renderReceiverContactInput(field)}
        name="receiverContact"
      />
      {errors.receiverContact && (
        <ErrorBox>
          <ErrorText>{errors.receiverContact.message}</ErrorText>
        </ErrorBox>
      )}
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

const Checkbox = styled.TouchableOpacity`
  margin-left: 8px;
`;
