// RN

// 3rd
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

// doobi comps
import BottomTabNav from './BottomTabNav';
import Login from '../../screens/login/Login';
import FoodDetail from '../../screens/foodDetail/FoodDetail';
import Account from '../../screens/account/Account';
import AddressEdit from '../../screens/addressEdit/AddressEdit';
import OrderComplete from '../../screens/orderComplete/OrderComplete';
import BackArrow from '../../shared/ui/BackArrow';
import KakaoPay from '../../components/payment/KakaoPay';
import Notice from '../../screens/notice/Notice';
import Order from '../../screens/order/Order';

// doobi shared
import colors from '../../shared/colors';
import UserInput from '../../screens/userInput/UserInput';
import Search from '../../screens/search/Search';
import AutoMenu from '../../screens/autoMenu/AutoMenu';
import Change from '../../screens/change/Change';
import Likes from '../../screens/like/Likes';
import CheckList from '../../screens/checklist/Checklist';
import OrderHistory from '../../screens/orderHistory/OrderHistory';
import OrderHistoryDetail from '../../screens/orderHistoryDetail/OrderHistoryDetail';
import MyBonus from '../../screens/MyBonus/MyBonus';
import RecommendCode from '../../screens/recommendCode/RecommendCode';
import ErrorPage from '../../screens/error/ErrorPage';

const Stack = createNativeStackNavigator();

const RootStackNav = () => {
  const {goBack, navigate} = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: colors.textMain,
        },
        headerShadowVisible: false,
        headerBackVisible: false,
        headerLeft: () => <BackArrow goBackFn={goBack} />,
      }}>
      {/* 로그인 */}
      <Stack.Screen name="Login" component={Login} />

      {/* 정보입력 */}
      <Stack.Screen
        name="UserInput"
        component={UserInput}
        options={{
          headerShown: true,
          headerTitle: '',
        }}
      />

      {/* 홈 - 마이페이지 - 좋아요 - 장바구니 */}
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />

      {/* 자동구성 가이드 */}
      <Stack.Screen
        name="AutoMenu"
        component={AutoMenu}
        options={{headerShown: true, headerTitle: ''}}
      />

      <Stack.Screen
        name="ManualAdd"
        component={Search}
        options={{headerShown: true, headerTitle: '식품선택'}}
      />

      <Stack.Screen
        name="Change"
        component={Change}
        options={{headerShown: true, headerTitle: '식품변경'}}
      />

      {/* 좋아요 식품 */}
      <Stack.Screen
        name="Likes"
        component={Likes}
        options={{
          headerShown: true,
          headerTitle: '찜한 상품',
        }}
      />

      {/* 식품상세 */}
      <Stack.Screen
        name="FoodDetail"
        component={FoodDetail}
        options={{
          headerShown: true,
          headerTitle: '',
        }}
      />

      {/* 주문 */}
      <Stack.Screen
        name="Order"
        component={Order}
        options={{
          headerShown: true,
          headerTitle: '주문 / 결제',
        }}
      />

      {/* 배송지 수정 */}
      <Stack.Screen
        name="AddressEdit"
        component={AddressEdit}
        options={{
          headerShown: true,
          headerTitle: '배송지',
        }}
      />

      {/* 카카오페이 */}
      <Stack.Screen name="KakaoPay" component={KakaoPay} />

      {/* history는 추후 추가 */}
      {/* <Stack.Screen name="HistoryNav" component={HistoryNav} /> */}

      {/* 주문정보 */}
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          headerShown: true,
          headerTitle: '구매내역',
        }}
      />
      <Stack.Screen
        name="OrderHistoryDetail"
        component={OrderHistoryDetail}
        options={{
          headerShown: true,
        }}
      />

      {/* 주문완료 */}
      <Stack.Screen name="OrderComplete" component={OrderComplete} />

      {/* 계정 설정 */}
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: true,
          headerTitle: '계정 설정',
        }}
      />

      {/* 공지사항 */}
      <Stack.Screen
        name="Notice"
        component={Notice}
        options={{
          headerShown: true,
          headerTitle: '공지사항',
        }}
      />

      {/* 추천코드 */}
      <Stack.Screen
        name="RecommendCode"
        component={RecommendCode}
        options={{
          headerShown: true,
          headerTitle: '추천코드',
        }}
      />

      {/* 내 보너스 현황 */}
      <Stack.Screen
        name="MyBonus"
        component={MyBonus}
        options={{
          headerShown: true,
          headerTitle: '내 보너스 현황',
        }}
      />

      {/* 체크리스트 */}
      <Stack.Screen
        name="Checklist"
        component={CheckList}
        options={{
          headerShown: true,
          headerTitle: '',
        }}
      />

      {/* 에러페이지 */}
      <Stack.Screen name="ErrorPage" component={ErrorPage} />
    </Stack.Navigator>
  );
};

export default RootStackNav;
