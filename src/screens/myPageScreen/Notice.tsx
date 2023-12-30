import {useNavigation} from '@react-navigation/native';
import {Container} from '../../styles/styledConsts';
import {link} from '../../util/common/linking';
import {
  INQUIRY_URL,
  KOREAN_NUTRITION_REFERENCE_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
} from '../../constants/constants';
import PageBtn from '../../components/myPage/PageBtn';

const Notice = () => {
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
      title: '참고문헌 (한국인영양섭취기준, 2020)',
      btnId: 'reference',
      onPress: () => link(KOREAN_NUTRITION_REFERENCE_URL),
    },
  ];

  return (
    <Container>
      <PageBtn btns={noticeBtns} />
    </Container>
  );
};

export default Notice;
