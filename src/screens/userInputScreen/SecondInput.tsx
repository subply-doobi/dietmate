import {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
//doobi util, redux, etc
import {RootState} from '../../stores/store';
import colors from '../../styles/colors';
import {
  BtnBottomCTA,
  Container,
  ErrorBox,
  ErrorText,
  InputHeaderText,
  TextMain,
  UserInfoTextInput,
  Col,
  StyledProps,
  HorizontalSpace,
} from '../../styles/StyledConsts';
import {calculateNutrTarget} from '../../util/targetCalculation';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {useNavigation, useRoute} from '@react-navigation/native';
import DTooltip from '../../components/common/tooltip/DTooltip';
import {useListCode} from '../../query/queries/code';
import {setValue} from '../../stores/slices/userInputSlice';

const SecondInput = () => {
  // redux
  const dispatch = useDispatch();
  const {sportsSeqCd, sportsTimeCd, sportsStrengthCd, bmrKnown} = useSelector(
    (state: RootState) => state.userInput,
  );

  // react-query
  const {data: seqCode} = useListCode('SP008'); // SP008 : 운동빈도 (sportsSeqCd)
  const {data: timeCode} = useListCode('SP009'); // SP009 : 운동시간 (sportsTimeCd)
  const {data: strengthCode} = useListCode('SP010'); // SP010 : 운동강도 (sportsStrengthCd)

  // navigation
  const {params} = useRoute();
  const {navigate} = useNavigation();

  // ref
  const scrollRef = useRef<ScrollView>(null);

  // etc
  const isValidAll = [
    sportsSeqCd.isValid,
    sportsTimeCd.isValid,
    sportsStrengthCd.isValid,
    bmrKnown.isValid,
  ].every(item => item === true);

  // 툴팁 텍스트
  const seqTooltipText = seqCode
    ? seqCode.findIndex(item => item.cd === sportsSeqCd.value) < 3
      ? '두비는 주 3회 이상 운동을 권장합니다'
      : seqCode?.findIndex(item => item.cd === sportsSeqCd.value) === 7
      ? '두비는 헬창을 응원합니다'
      : ''
    : '';

  const onCTAPress = () => {
    navigate('InputNav', {screen: 'ThirdInput', params});
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{paddingBottom: 80}} ref={scrollRef}>
        <Title>{'선택 정보를\n입력해주세요'}</Title>
        <SubText>입력된 정보로 목표 칼로리를 계산해드려요</SubText>
        <HorizontalSpace height={16} />

        {/* 주간 운동횟수 */}
        <Col style={{width: '100%'}}>
          <ContainerTitleText>주간 운동횟수</ContainerTitleText>
          <BtnContainer>
            {seqCode?.map((item, idx) => {
              return (
                <Btn
                  key={idx}
                  onPress={() =>
                    dispatch(setValue({name: 'sportsSeqCd', value: item.cd}))
                  }
                  isActivated={sportsSeqCd.value === item.cd}>
                  <BtnText isActivated={sportsSeqCd.value === item.cd}>
                    {item.cdNm}
                  </BtnText>
                </Btn>
              );
            })}
          </BtnContainer>

          {/* 주간 운동횟수 툴팁 */}
          <Col>
            <DTooltip
              tooltipShow={!!seqTooltipText}
              boxTop={8}
              boxLeft={0}
              triangle={false}
              text={seqTooltipText}
            />
          </Col>
        </Col>

        {/* 회당 운동시간 (분)*/}
        {sportsSeqCd.value !== 'SP008001' && (
          <Col style={{width: '100%'}}>
            <ContainerTitleText>회당 운동시간 (분)</ContainerTitleText>
            <BtnContainer>
              {timeCode?.map((item, idx) => {
                return (
                  <Btn
                    key={idx}
                    onPress={() =>
                      dispatch(setValue({name: 'sportsTimeCd', value: item.cd}))
                    }
                    isActivated={sportsTimeCd.value === item.cd}>
                    <BtnText isActivated={sportsTimeCd.value === item.cd}>
                      {item.cdNm}
                    </BtnText>
                  </Btn>
                );
              })}
            </BtnContainer>
          </Col>
        )}

        {/* 운동강도 (누가뭐래도 내 느낌) */}
        {sportsSeqCd.value !== 'SP008001' && (
          <Col style={{width: '100%'}}>
            <ContainerTitleText>
              운동강도 (누가뭐래도 내 느낌)
            </ContainerTitleText>
            <BtnContainer>
              {strengthCode?.map((item, idx) => {
                return (
                  <StrengthBtn
                    key={item.cd}
                    isActivated={sportsStrengthCd.value === item.cd}
                    onPress={() =>
                      dispatch(
                        setValue({name: 'sportsStrengthCd', value: item.cd}),
                      )
                    }>
                    <BtnText isActivated={sportsStrengthCd.value === item.cd}>
                      {item.cdNm}
                    </BtnText>
                  </StrengthBtn>
                );
              })}
            </BtnContainer>
          </Col>
        )}

        {/* 기초대사량 */}
        <InputHeader isActivated={!!bmrKnown.value}>
          기초대사량(kcal)
        </InputHeader>
        <Input
          placeholder="기초대사량을 알고있다면 적어주세요 (kcal)"
          value={bmrKnown.value}
          onChangeText={v => dispatch(setValue({name: 'bmrKnown', value: v}))}
          isActivated={!!bmrKnown.value}
          keyboardType="numeric"
          maxLength={4}
          onFocus={() => {
            console.log('scrollToEnd!!');
            setTimeout(() => {
              scrollRef.current.scrollToEnd({animated: true});
            }, 50);
          }}
        />
        {bmrKnown.errMsg && (
          <ErrorBox>
            <ErrorText>{bmrKnown.errMsg}</ErrorText>
          </ErrorBox>
        )}
      </ScrollView>

      {/* CTA버튼 */}
      <BtnBottomCTA
        btnStyle={isValidAll ? 'activated' : 'inactivated'}
        disabled={!isValidAll}
        onPress={() => onCTAPress()}>
        <BtnCTAText>다음</BtnCTAText>
      </BtnBottomCTA>
    </Container>
  );
};

export default SecondInput;

const Title = styled(TextMain)`
  font-size: 24px;
  font-weight: bold;
`;
const SubText = styled(TextMain)`
  font-size: 16px;
  margin-top: 16px;
  color: ${colors.textSub};
`;
const InputHeader = styled(InputHeaderText)`
  margin-top: 48px;
`;
const Input = styled(UserInfoTextInput)``;

const Nutr = styled(TextMain)`
  font-size: 18px;
`;

const BtnContainer = styled.View`
  margin-top: 16px;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Btn = styled.TouchableOpacity`
  width: 72px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
  background-color: ${colors.white};
`;

const BtnText = styled(TextMain)`
  font-size: 14px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.textMain : colors.textSub};
`;
const BtnCTAText = styled(TextMain)`
  font-size: 16px;
  color: ${colors.white};
`;

const ContainerTitleText = styled(TextMain)`
  font-size: 18px;
  margin-top: 48px;
`;

const StrengthBtnContainer = styled.View`
  margin-top: 16px;
  row-gap: 8px;
`;

const StrengthBtnText = styled(TextMain)`
  font-size: 14px;
`;
const StrengthBtn = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: ${colors.white};

  border-radius: 5px;
  border-width: 1px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};

  align-items: center;
  justify-content: center;
`;
