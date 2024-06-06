import {useNavigation} from '@react-navigation/native';
import {Container, HorizontalSpace} from '../../shared/ui/styledComps';
import ListBtns from '../../shared/ui/ListBtns';
import Card from './ui/Card';
import {useGetUser} from '../../shared/api/queries/user';
import {
  useCreateSuggestUser,
  useGetSuggestUser,
  useGetSuggestUserExistYn,
  useUpdateSuggestUser,
} from '../../shared/api/queries/suggest';
import {useState} from 'react';
import DAlert from '../../shared/ui/DAlert';
import CodeAlertContent from './ui/CodeAlertContent';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';
import {setValue} from '../../features/reduxSlices/userInputSlice';
import {icons} from '../../shared/iconSource';

const RecommendCode = () => {
  // redux
  const dispatch = useDispatch();
  const {friendCd} = useSelector((state: RootState) => state.userInput);

  // navigation
  const {navigate} = useNavigation();

  // react-query
  const {data: userData} = useGetUser();

  const isSuggestUserExist = Boolean(userData?.suggestFromCd);
  const createSuggestUserMutation = useCreateSuggestUser();
  const updateSuggestUserMutation = useUpdateSuggestUser();

  // useState
  const [codeAlertShow, setCodeAlertShow] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  // etc
  const btns = [
    {
      title: isSuggestUserExist
        ? '추천해준 친구코드 변경'
        : '추천해준 친구코드 등록',
      btnId: 'Edit',
      onPress: () => {
        dispatch(
          setValue({name: 'friendCd', value: userData?.suggestFromCd || ''}),
        );
        setCodeAlertShow(true);
      },
    },
    {
      title: '내 보너스 현황',
      btnId: 'MyBonus',
      onPress: () => navigate('MyBonus'),
    },
  ];

  // fn
  const onCodeAlertConfirm = async () => {
    if (friendCd.value === '') {
      setIsCodeError(true);
      return;
    }

    if (isSuggestUserExist) {
      try {
        const res = await updateSuggestUserMutation.mutateAsync(friendCd.value);
        console.log('update: res', res);
      } catch (e) {
        console.log('update catch e: ', e);
      }
    } else {
      try {
        const res = await createSuggestUserMutation.mutateAsync(friendCd.value);
        console.log('create: res', res);
      } catch (e) {
        console.log('create catch e: ', e);
      }
    }

    setCodeAlertShow(false);
  };

  const onCodeAlertCancel = () => {
    setCodeAlertShow(false);
    setIsCodeError(false);
  };
  console.log(friendCd.value);
  return (
    <Container>
      <Card
        label="내 코드"
        value={userData?.suggestCd}
        style={{marginTop: 40}}
      />
      {isSuggestUserExist && (
        <Card
          label="친구 코드 등록 완료"
          value={userData?.suggestFromCd}
          style={{marginTop: 24, height: 48}}
          icon={icons.checkRoundCheckedGreen_24}
        />
      )}
      <HorizontalSpace height={64} />
      <ListBtns btns={btns} />

      <DAlert
        alertShow={codeAlertShow}
        onCancel={onCodeAlertCancel}
        onConfirm={onCodeAlertConfirm}
        renderContent={() => <CodeAlertContent isCodeError={isCodeError} />}
        NoOfBtn={2}
      />
    </Container>
  );
};

export default RecommendCode;
