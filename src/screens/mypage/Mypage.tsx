// RN
import {ScrollView} from 'react-native';

// 3rd
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// doobi
import colors from '../../shared/colors';
import {Container} from '../../shared/ui/styledComps';
import DAlert from '../../shared/ui/DAlert';
import ListBtns from '../../shared/ui/ListBtns';
import {link} from '../../shared/utils/linking';
import {INQUIRY_URL} from '../../shared/constants';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';
import {updateNotShowAgainList} from '../../shared/utils/asyncStorage';
import {setTutorialStart} from '../../features/reduxSlices/commonSlice';
import {RootState} from '../../app/store/reduxStore';
import {openModal, closeModal} from '../../features/reduxSlices/modalSlice';
import {icons} from '../../shared/iconSource';

const Mypage = () => {
  // navigation
  const {navigate, reset} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const tutorialRestartAlert = useSelector(
    (state: RootState) => state.modal.modal.tutorialRestartAlert,
  );

  // etc
  // btns
  const myPageBtns = [
    {
      title: '이용방법',
      btnId: 'Tutorial',
      onPress: () => dispatch(openModal({name: 'tutorialRestartAlert'})),
      iconSource: icons.question_mypage_24,
    },
    {
      title: '목표변경',
      btnId: 'TargeChange',
      onPress: () => navigate('UserInput', {from: 'Mypage'}),
      iconSource: icons.target_mypage_24,
    },
    {
      title: '추천코드',
      btnId: 'recommendCode',
      onPress: () => navigate('RecommendCode'),
      iconSource: icons.code_mypage_24,
    },
    {
      title: '찜한상품',
      btnId: 'Likes',
      onPress: () => navigate('Likes'),
      iconSource: icons.heart_myPage_24,
    },
    {
      title: '주문내역',
      btnId: 'OrderHistory',
      onPress: () => navigate('OrderHistory'),
      iconSource: icons.card_mypage_24,
    },
    {
      title: '공지사항',
      btnId: 'Notice',
      onPress: () => navigate('Notice'),
      iconSource: icons.notice_mypage_24,
    },
    {
      title: '계정설정',
      btnId: 'Account',
      onPress: () => navigate('Account'),
      iconSource: icons.account_mypage_24,
    },
    {
      title: '문의하기',
      btnId: 'Inquiry',
      onPress: () => link(INQUIRY_URL),
      iconSource: icons.chat_mypage_24,
    },
  ];

  const goTutorial = async () => {
    dispatch(closeModal({name: 'tutorialRestartAlert'}));
    dispatch(setTutorialStart());
    await updateNotShowAgainList({key: 'tutorial', value: false});
    reset({
      index: 0,
      routes: [
        {
          name: 'BottomTabNav',
          params: {
            screen: 'NewHome',
          },
        },
      ],
    });
  };

  return (
    <Container
      style={{
        paddingLeft: 0,
        paddingRight: 0,
      }}>
      {/* 메뉴 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <ListBtns btns={myPageBtns} />
        </Card>
      </ScrollView>

      {/* 튜토리얼 진행 알럿 */}
      <DAlert
        alertShow={tutorialRestartAlert.isOpen}
        renderContent={() => (
          <CommonAlertContent
            text="튜토리얼을 다시 진행할까요?"
            subText="구성한 끼니가 있다면 삭제됩니다"
          />
        )}
        onConfirm={goTutorial}
        onCancel={() => dispatch(closeModal({name: 'tutorialRestartAlert'}))}
        confirmLabel="진행"
        NoOfBtn={2}
      />
    </Container>
  );
};

export default Mypage;

const Card = styled.View`
  width: 100%;
  background-color: ${colors.white};
  padding: 64px 16px 16px 16px;
`;
