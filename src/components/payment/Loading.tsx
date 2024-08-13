import {View, Image, Text, StyleSheet} from 'react-native';

const logo = require('../../shared/assets/appIcon/appIcon.png');

function Loading() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={{width: 50, height: 50}} />
      <Text style={styles.text}>잠시만 기다려주세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    marginTop: 20,
    lineHeight: 20,
  },
});

export default Loading;
