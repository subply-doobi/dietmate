/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {androidAppName, iosAppName} from './app.json';

if (Platform.OS === 'ios') {
  AppRegistry.registerComponent(iosAppName, () => App);
} else if (Platform.OS === 'android') {
  AppRegistry.registerComponent(androidAppName, () => App);
}
