import {useEffect, useState} from 'react';
import {View, Pressable, ScrollView, Modal, SafeAreaView} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import Postcode from '@actbase/react-daum-postcode';

import {RootState} from '../../stores/store';
import {setselectedAddrIdx} from '../../stores/slices/orderSlice';
import {icons} from '../../assets/icons/iconSource';
import {SCREENWIDTH} from '../../constants/constants';
import {
  AlertContentContainer,
  BtnCTA,
  BtnText,
  Container,
  HorizontalSpace,
  InputHeaderText,
  Row,
  StickyFooter,
  TextMain,
  TextSub,
  UserInfoTextInput,
} from '../../styles/styledConsts';
import colors from '../../styles/colors';

import DAlert from '../../components/common/alert/DAlert';
import {useCreateAddress, useListAddress} from '../../query/queries/address';
import {useDeleteAddress, useUpdateAddress} from '../../query/queries/address';
import {useNavigation, useRoute} from '@react-navigation/native';

import {setAddrBase, setValue} from '../../stores/slices/userInputSlice';
import {OnCompleteParams} from '@actbase/react-daum-postcode/lib/types';

const renderDeleteAlertContent = () => (
  <AlertContentContainer>
    <AlertText>해당 배송지를</AlertText>
    <AlertText>삭제하시겠어요?</AlertText>
  </AlertContentContainer>
);

const AddressEdit = () => {
  // redux
  const dispatch = useDispatch();
  const {selectedAddrIdx} = useSelector((state: RootState) => state.order);
  const {addr1, addr2, zipCode} = useSelector(
    (state: RootState) => state.userInput,
  );

  console.log('AddressEdit: selector: ', addr1, addr2, zipCode);

  // navigation
  const {navigate, setOptions} = useNavigation();
  const route = useRoute();

  //react-query
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const {data: listAddressData} = useListAddress();

  // useState
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [addressDeleteAlertShow, setAddressDeleteAlertShow] = useState(false);

  // useEffect
  useEffect(() => {
    setOptions({
      headerTitle: isUpdate ? '배송지 변경' : '배송지 추가',
    });
  }, [route?.params]);

  // etc
  const addrNo = route.params?.addrNo ?? route.params?.addrNo;
  const addrIdx = listAddressData?.findIndex(v => v.addrNo === addrNo);
  const isUpdate = !!route.params?.addrNo;
  const hasAddrValue = !!addr1.value && !!zipCode.value;
  let ctaBtnText = !hasAddrValue
    ? '주소를 입력해주세요'
    : addr2.value === ''
    ? '상세주소를 입력해주세요'
    : '확인';

  // 주소 update or create
  const onConfirmBtnPress = () => {
    if (!addr1.value || !zipCode.value) return;
    if (isUpdate) {
      // addressUpdate
      updateAddressMutation.mutate({
        addrNo: route.params?.addrNo,
        zipCode: zipCode.value,
        addr1: addr1.value,
        addr2: addr2.value,
      });
      navigate('Order');
      return;
    }
    // addressCreate
    createAddressMutation.mutate({
      zipCode: zipCode.value,
      addr1: addr1.value,
      addr2: addr2.value,
    });
    dispatch(setselectedAddrIdx(listAddressData ? listAddressData.length : 0));
    navigate('Order');
  };

  // 우편번호 검색 후 주소 선택
  const onPostCodeSelected = (data: OnCompleteParams) => {
    dispatch(
      setAddrBase({
        addr1: data.roadAddress,
        zipCode: String(data.zonecode),
      }),
    );
    setPostModalVisible(false);
  };

  // 주소 삭제
  const onDeleteAlertConfirm = () => {
    const nextAddrIdx =
      addrIdx === undefined || selectedAddrIdx === 0
        ? 0
        : selectedAddrIdx < addrIdx
        ? selectedAddrIdx
        : selectedAddrIdx - 1;

    deleteAddressMutation.mutate(addrNo);
    dispatch(setselectedAddrIdx(nextAddrIdx));
    navigate('Order');
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
          <Container>
            {hasAddrValue && (
              <>
                {/* 기본주소 */}
                <Row style={{marginTop: 24, justifyContent: 'space-between'}}>
                  <PostalCode>우편번호: {zipCode.value}</PostalCode>
                  {isUpdate && (
                    <AddressDeleteBtn
                      onPress={() => setAddressDeleteAlertShow(true)}>
                      <AddressDeleteIcon source={icons.cancelRound_24} />
                    </AddressDeleteBtn>
                  )}
                </Row>
                <AddressBase>{addr1.value}</AddressBase>
                <HorizontalSpace height={8} />

                {/* 상세주소 */}
                <InputHeader isActivated={!!addr2.value}>상세주소</InputHeader>
                <Input
                  placeholder={'상세주소'}
                  value={addr2.value}
                  onChangeText={v =>
                    dispatch(setValue({name: 'addr2', value: v}))
                  }
                  isActivated={!!addr2.value}
                  keyboardType="default"
                />
              </>
            )}

            {/* 주소찾기 modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={postModalVisible}
              onRequestClose={() => setPostModalVisible(!postModalVisible)}
              style={{
                flex: 1,
                margin: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ModalBackground>
                <ModalOutside onPress={() => setPostModalVisible(false)} />
                {/* daum-post-code */}
                <Postcode
                  style={{width: SCREENWIDTH - 32, height: 410}}
                  jsOptions={{animation: true, hideMapBtn: false}}
                  onSelected={data => onPostCodeSelected(data)}
                  onError={() => console.error('오류')}
                />
              </ModalBackground>
            </Modal>

            {/* 주소 delete 알럿 */}
            <DAlert
              alertShow={addressDeleteAlertShow}
              onCancel={() => setAddressDeleteAlertShow(false)}
              onConfirm={() => onDeleteAlertConfirm()}
              renderContent={renderDeleteAlertContent}
              confirmLabel={'삭제'}
            />
          </Container>
        </ScrollView>

        {/* 1. 주소추가,변경 | 2. 확인 버튼 */}
        <BtnBox>
          <AddressEditBtn
            btnStyle="border"
            onPress={() => setPostModalVisible(true)}>
            <BtnText style={{color: colors.textSub, fontSize: 16}}>
              {hasAddrValue ? '주소 전체변경' : ' + 주소 추가'}
            </BtnText>
          </AddressEditBtn>
          <AddressConfirmBtn
            btnStyle={ctaBtnText === '확인' ? 'activated' : 'inactivated'}
            disabled={ctaBtnText !== '확인'}
            onPress={() => onConfirmBtnPress()}>
            <BtnText>{ctaBtnText}</BtnText>
          </AddressConfirmBtn>
        </BtnBox>
      </SafeAreaView>
    </>
  );
};

export default AddressEdit;

const PostalCode = styled(TextSub)`
  font-size: 16px;
`;

const AddressDeleteBtn = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
`;

const AddressDeleteIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const AddressBase = styled(TextMain)`
  font-size: 20px;
  margin-top: 16px;
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
const Input = styled(UserInfoTextInput)``;

const AddressEditBtn = styled(BtnCTA)`
  height: 48px;
`;
const AddressConfirmBtn = styled(BtnCTA)`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const AlertText = styled(TextMain)`
  font-size: 16px;
  align-self: center;
`;
const ModalBackground = styled.View`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000a6;
`;

const ModalOutside = styled.Pressable`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const BtnBox = styled(StickyFooter)``;
