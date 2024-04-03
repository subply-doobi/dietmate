import styled from 'styled-components/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {icons} from '../../shared/iconSource';

import FirstInput from '../../screens/userInput/FirstInput';
import SecondInput from '../../screens/userInput/SecondInput';
import ThirdInput from '../../screens/userInput/ThirdInput';
import Start from '../../screens/userInput/ui/subScreens/Start';
import Sex from '../../screens/userInput/ui/subScreens/Gender';
import {getHeaderTitle} from '@react-navigation/elements';
import Header from '../../shared/ui/Header';
import Age from '../../screens/userInput/ui/subScreens/Age';
import {height} from '../../shared/constants';
import Amr from '../../screens/userInput/ui/subScreens/Amr';
import Purpose from '../../screens/userInput/ui/subScreens/Purpose';
import TargetManual from '../../screens/userInput/ui/subScreens/TargetManual';
import TargetOptions from '../../screens/userInput/ui/subScreens/TargetOptions';
import TargetRatio from '../../screens/userInput/ui/subScreens/TargetRatio';
import WODuration from '../../screens/userInput/ui/subScreens/WODuration';
import WOFrequency from '../../screens/userInput/ui/subScreens/WOFrequency';
import Weight from '../../screens/userInput/ui/subScreens/Weight';
import WOIntensity from '../../screens/userInput/ui/subScreens/WOIntensity';
import Height from '../../screens/userInput/ui/subScreens/Height';

const PROGRESS_BY_SCR: {[key: string]: number} = {
  Start: 0,
  Sex: 1,
  Age: 2,
  Height: 3,
  Weight: 4,
  Purpose: 5,
  WOFrequency: 6,
  Amr: 7,
  WODuration: 8,
  WOIntensity: 9,
  TargetOptions: 10,
  TargetRatio: 11,
  TargetManual: 12,
};

const Stack = createNativeStackNavigator();
const InputNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        header: ({navigation, route, options, back}) => {
          const headerTitle = getHeaderTitle(options, route.name);
          return (
            <Header
              headerTitle={headerTitle === 'Start' ? '' : headerTitle}
              navigation={navigation}
              canGoBack={!!back}
              progress={
                PROGRESS_BY_SCR[headerTitle] /
                (Object.keys(PROGRESS_BY_SCR).length - 1)
              }
            />
          );
        },
      }}>
      {/* <Stack.Screen
        name="FirstInput"
        component={FirstInput}
        options={{
          headerTitle: '',
          headerRight: () => <StepIcon source={icons.step1_36} />,
        }}
      />
      <Stack.Screen
        name="SecondInput"
        component={SecondInput}
        options={{
          headerTitle: '',
          headerRight: () => <StepIcon source={icons.step2_36} />,
        }}
      />
      <Stack.Screen
        name="ThirdInput"
        component={ThirdInput}
        options={{
          headerTitle: '',
          headerRight: () => <StepIcon source={icons.step3_36} />,
        }}
      /> */}
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Sex" component={Sex} />
      <Stack.Screen name="Age" component={Age} />
      <Stack.Screen name="Height" component={Height} />
      <Stack.Screen name="Weight" component={Weight} />
      <Stack.Screen name="Purpose" component={Purpose} />
      <Stack.Screen name="WOFrequency" component={WOFrequency} />
      <Stack.Screen name="Amr" component={Amr} />
      <Stack.Screen name="WODuration" component={WODuration} />
      <Stack.Screen name="WOIntensity" component={WOIntensity} />
      <Stack.Screen name="TargetOptions" component={TargetOptions} />
      <Stack.Screen name="TargetRatio" component={TargetRatio} />
      <Stack.Screen name="TargetManual" component={TargetManual} />
    </Stack.Navigator>
  );
};

export default InputNav;

const StepIcon = styled.Image`
  width: 36px;
  height: 36px;
`;
