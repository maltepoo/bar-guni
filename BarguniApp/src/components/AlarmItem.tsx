import React, {useCallback, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AlarmI, changeAlarm, deleteAlarm} from '../api/basket';
import {Button} from '@rneui/base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Dialog, Paragraph, Portal} from "react-native-paper";
interface Props {
  item: AlarmI;
  remove: Function;
}
function AlarmItem({item, remove, reload}: Props) {
  console.log(item);
  const [alertVisible, setAlertVisible] = useState(false);
  const closeDialog = useCallback(() => {setAlertVisible(false)});

  const changeStatusAlarm = useCallback(async () => {
    try {
      await changeAlarm(item.id);
      reload();
    } catch (e) {}
  }, [item.id]);

  const confirmDelete = useCallback(() => {
    setAlertVisible(true);
  });

  const removeAlarm = useCallback(async () => {
    try {
      await deleteAlarm(item.id);
      remove(item.id);
    } catch (e) {}
  }, [item.id]);

  return (
    <>
      <Portal>
        <Dialog visible={alertVisible} onDismiss={closeDialog}>
          <Dialog.Title>알림을 삭제하시겠습니까?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{item.title.split(0, 7)}... 의 알림을 삭제합니다.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button title={'확인'} onPress={removeAlarm} titleStyle={{color: '#fff'}} buttonStyle={{...Style.button, marginRight: 6, backgroundColor: '#c4c4c4'}} />
            <Button title={'취소'} onPress={closeDialog} buttonStyle={Style.button} />
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <TouchableOpacity style={Style.container} onPress={changeStatusAlarm} onLongPress={confirmDelete}>
        <View style={Style.dotContainer}>
          <FontAwesomeIcon name="circle" size={8} style={{
            color: item.status === "UNCHECKED" ? '#0094FF' : '#F5F4F4',
          }} />
        </View>
        <Text
          key={item.itemId}
          ellipsizeMode="tail"
          numberOfLines={2}
          style={{...Style.multiline, color: item.status === "UNCHECKED" ? "#000" : "#C4C4C4"}}>
          {item.title}
        </Text>
        <Text style={Style.time}>
          {Math.ceil(
            (new Date().getTime() - new Date(item.createdAt).getTime()) /
              (1000 * 3600 * 24),
          )}
          일 전
        </Text>
      </TouchableOpacity>
      <View style={Style.line} />
    </>
  );
}
const Style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dotContainer: {
    alignItems: 'center',
    paddingTop: 7,
  },
  multiline: {
    width: '80%',
    marginLeft: 5,
    fontSize: 15,
    paddingHorizontal: 10,
  },
  time: {
    fontSize: 12,
    color: '#C4C4C4',
    textAlign: 'right',
  },
  line: {
    width: '100%',
    height: 0.7,
    backgroundColor: '#F5F4F4',
    marginTop: 15,
  },
  button: {
    paddingHorizontal: 16,
    backgroundColor: '#0094FF',
  }
});

export default AlarmItem;
