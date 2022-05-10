import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {getBasketInfo} from "../api/basket";

function BasketInvite({route}) {
  const basketInfo = route.params;
  console.log(basketInfo, "invite basket Info")
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    init();
  }, [])

  const init = useCallback(async () => {
    try {
      const res = await getBasketInfo(basketInfo.bkt_id);
      await setInviteCode(res.joinCode);
      console.log(res, "바스켓 조회")
    } catch (e) {
      console.log(e, "ERROR IN BASKET INVITE")
    }
  });

  const copyInviteCode = useCallback(() => {
    Alert.alert('초대코드가 복사되었습니다', "구라지만...")
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('../assets/basket_emoji.png')} style={styles.titleImg}/>
        <Text style={{...styles.title, marginTop: 16}}>초대코드를 복사하여</Text>
        <Text style={{...styles.title, marginBottom: 20}}>친구를 초대해보세요!</Text>
      </View>
      <View style={styles.inviteContainer}>
        <TextInput value={inviteCode} editable={false} selectTextOnFocus={true} style={styles.inviteText}/>
        <Feather name="link" style={styles.linkIcon}/>
      </View>
      <Pressable onPress={copyInviteCode} style={styles.inviteBtn}>
        <Text style={styles.inviteBtnText}>초대코드 복사</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleImg: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  titleContainer: {
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontWeight: "900",
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },
  inviteContainer: {
    backgroundColor: '#F5F4F4',
    position: 'relative',
    borderRadius: 100,
  },
  inviteText: {
    color: '#000',
    paddingLeft: 20,
    paddingRight: 40,
    fontSize: 16,
  },
  linkIcon: {
    position: 'absolute',
    top: '35%',
    right: 18,
  },
  inviteBtn: {
    backgroundColor: '#F5F4F4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginTop: 28,
  },
  inviteBtnText: {
    color: '#0094FF',
    fontWeight: 'bold',
    fontSize: 12,
  }
})

export default BasketInvite;