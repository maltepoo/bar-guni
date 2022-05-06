import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Tooltip from './Tooltip';

function InviteModal(props) {
  return (
    <View style={styles.modalContainer}>
      <Text>초대모달</Text>
      <TextInput value="초대코드" editable={false} />
      <Entypo name={'link'} />
      <Tooltip title={'링크를 복사하여 바구니에 초대하세요!'} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    position: 'absolute',
    width: 200,
    backgroundColor: 'lightyellow',
    left: '23%',
    top: '30%',
    padding: 20,
    zIndex: 10,
  },
});

export default InviteModal;
