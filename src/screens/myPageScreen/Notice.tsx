import {useNavigation} from '@react-navigation/native';
import {Container} from '../../styles/styledConsts';
import {link} from '../../util/common/linking';
import {
  INQUIRY_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
} from '../../constants/constants';
import PageBtn from '../../components/myPage/PageBtn';

const Notice = () => {
  // navigation
  const {navigate} = useNavigation();

  // etc
  // notice btns
  const noticeBtns = [
    {
      title: '개인정보 처리방침',
      btnId: 'Notice',
      onPress: () => link(PRIVACY_POLICY_URL),
    },
    {
      title: '이용약관',
      btnId: 'Terms',
      onPress: () => link(TERMS_OF_USE_URL),
    },
    {
      title: '문의하기',
      btnId: 'Inquiry',
      onPress: () => link(INQUIRY_URL),
    },
  ];

  return (
    <Container>
      <PageBtn btns={noticeBtns} />
    </Container>
  );
};

export default Notice;
