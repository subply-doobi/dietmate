// Description: 첫번째 유저 정보 입력 화면
//RN, 3rd
import {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
//doobi util, redux, etc
import {RootState} from '../../stores/store';
import {DIET_PURPOSE_CD} from '../../constants/constants';

//doobi Component
import {
  BtnBottomCTA,
  BtnText,
  Container,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  Row,
  StyledProps,
  TextMain,
  UserInfoTextInput,
  VerticalSpace,
} from '../../styles/styledConsts';

import Dropdown from '../../components/userInput/Dropdown';
//react-query
import {useGetBaseLine} from '../../query/queries/baseLine';
import {useListCode} from '../../query/queries/code';
import {useNavigation, useRoute} from '@react-navigation/native';
import {loadBaseLineData, setValue} from '../../stores/slices/userInputSlice';
import colors from '../../styles/colors';
import DTextInput from '../../components/common/textInput/DTextInput';

const genderBtnItem = [
  {label: '남성', value: 'M'},
  {label: '여성', value: 'F'},
];

const FirstInput = () => {
  // navigation
  const {params} = useRoute();
  const navigation = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {gender, age, height, weight, dietPurposeCd} = useSelector(
    (state: RootState) => state.userInput,
  );

  // useState
  const [dietPurposeTemp, setDietPurposeTemp] = useState(dietPurposeCd.value);

  // react-query
  const {data: baseLineData, isLoading: isBaseLineDataLoading} =
    useGetBaseLine();
  const {data: dPCodeData, isLoading: isDPCodeDataLoading} =
    useListCode('SP002'); // SP002 : 식단의 목적
  const dietPurposeDDItems = dPCodeData?.map(item => {
    return {value: item.cd, label: item.cdNm};
  });

  // refs
  const scrollRef = useRef<ScrollView>(null);
  const userInfo1Refs = useRef([]);

  // useEffect
  useEffect(() => {
    dispatch(setValue({name: 'dietPurposeCd', value: dietPurposeTemp}));
    // dropdown picker에는 setStateAction 만 가능
    // 우리는 redux로 관리하고 있으므로 임시로 useState를 만들어서 관리
  }, [dietPurposeTemp]);

  useEffect(() => {
    // 첫 회원가입한 후 baseLine 없으면 빈 오브젝트 !!! baseLineData 자체가 false는 아님!!
    baseLineData &&
      Object.keys(baseLineData).length !== 0 &&
      dispatch(loadBaseLineData(baseLineData));
  }, []);

  // etc
  const isValidAll = [
    gender.isValid,
    age.isValid,
    height.isValid,
    weight.isValid,
  ].every(item => item === true);

  const onCTAPress = () => {
    navigation.navigate('InputNav', {
      screen: 'SecondInput',
      params,
    });
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{paddingBottom: 80}}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        <Title>{'기본정보를\n입력해주세요'}</Title>

        {/* gender */}
        <Row style={{justifyContent: 'space-between', columnGap: 8}}>
          {genderBtnItem.map((item, index) => (
            <BtnToggle
              key={index}
              isActivated={gender.value === item.value}
              onPress={() =>
                dispatch(setValue({name: 'gender', value: item.value}))
              }>
              <ToggleText isActivated={gender.value === item.value}>
                {item.label}
              </ToggleText>
            </BtnToggle>
          ))}
        </Row>

        {/* age */}
        <InputHeader isActivated={!!age.value}>만 나이</InputHeader>
        <DTextInput
          placeholder="만 나이를 입력해주세요"
          value={age.value}
          onChangeText={v => dispatch(setValue({name: 'age', value: v}))}
          isActivated={!!age.value}
          isValid={age.isValid}
          keyboardType="numeric"
          maxLength={3}
          ref={el => {
            userInfo1Refs ? (userInfo1Refs.current[0] = el) : null;
          }}
          onSubmitEditing={() => {
            userInfo1Refs?.current[1].focus();
          }}
        />
        {age.errMsg && (
          <ErrorBox>
            <ErrorText>{age.errMsg}</ErrorText>
          </ErrorBox>
        )}

        {/* height */}
        <InputHeader isActivated={!!height.value}>신장(cm)</InputHeader>
        <DTextInput
          placeholder="신장을 입력해주세요"
          onFocus={() => {
            scrollRef?.current.scrollTo({y: 80, animated: true});
          }}
          value={height.value}
          onChangeText={v => dispatch(setValue({name: 'height', value: v}))}
          isActivated={!!height.value}
          isValid={height.isValid}
          keyboardType="numeric"
          maxLength={3}
          ref={el => {
            userInfo1Refs ? (userInfo1Refs.current[1] = el) : null;
          }}
          onSubmitEditing={() => {
            userInfo1Refs?.current[2].focus();
          }}
        />
        {height.errMsg && (
          <ErrorBox>
            <ErrorText>{height.errMsg}</ErrorText>
          </ErrorBox>
        )}

        {/* weight */}
        <InputHeader isActivated={!!weight.value}>몸무게(kg)</InputHeader>
        <DTextInput
          placeholder="몸무게를 입력해주세요"
          onFocus={() => {
            scrollRef?.current.scrollToEnd();
          }}
          value={weight.value}
          onChangeText={v => dispatch(setValue({name: 'weight', value: v}))}
          isActivated={!!weight.value}
          isValid={weight.isValid}
          keyboardType="numeric"
          maxLength={3}
          ref={el => {
            userInfo1Refs ? (userInfo1Refs.current[2] = el) : null;
          }}
        />
        {weight.errMsg && (
          <ErrorBox>
            <ErrorText>{weight.errMsg}</ErrorText>
          </ErrorBox>
        )}

        {/* --- purpose --- */}
        <Dropdown
          placeholder="식단의 목적"
          items={
            dPCodeData
              ? dietPurposeDDItems
              : DIET_PURPOSE_CD.map(item => ({
                  value: item.cd,
                  label: item.cdNm,
                }))
          }
          value={dietPurposeTemp}
          setValue={setDietPurposeTemp}
          scrollRef={scrollRef}
        />
      </ScrollView>
      <BtnBottomCTA
        btnStyle={isValidAll ? 'activated' : 'inactivated'}
        disabled={!isValidAll}
        height={52}
        onPress={() => onCTAPress()}>
        <BtnText>다음</BtnText>
      </BtnBottomCTA>
    </Container>
  );
};

export default FirstInput;

const Title = styled(TextMain)`
  font-size: 24px;
  font-weight: bold;
`;

const BtnToggle = styled.TouchableOpacity`
  flex: 1;
  height: 48px;
  margin-top: 48px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-radius: 4px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
`;

const ToggleText = styled.Text`
  font-size: 16px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
