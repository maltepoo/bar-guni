import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Vibration, View} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import {barcodeItemInfo} from '../api/item';
import {AxiosError} from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';

type BarcodeScreenProp = NativeStackScreenProps<RootStackParamList, 'Barcode'>;
function Barcode({navigation}: BarcodeScreenProp) {
  const [scaned, setScaned] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    // 종료후 재시작을 했을때 초기화
    setScaned(true);
  }, []);

  const onBarCodeRead = async (event: any) => {
    if (!scaned) {
      return;
    }
    setScaned(false);
    try {
      const res = await barcodeItemInfo(event.nativeEvent.codeStringValue);
      console.log(res);
      navigation.navigate('Register', res);
    } catch (e: AxiosError | any) {
      console.log(e);
      console.log(e.code);
    }
    Alert.alert('QR Code', event.nativeEvent.codeStringValue, [
      {text: 'OK', onPress: () => setScaned(true)},
    ]);
  };
  return (
    <View>
      <Camera
        style={style.scanner}
        ref={ref}
        cameraType={CameraType.Back} // Front/Back(default)
        // Barcode Scanner Props
        scanBarcode
        showFrame={false}
        laserColor="rgba(0, 0, 0, 0)"
        frameColor="rgba(0, 0, 0, 0)"
        surfaceColor="rgba(0, 0, 0, 0)"
        onReadCode={onBarCodeRead}
      />
    </View>
  );
}
const style = StyleSheet.create({
  scanner: {
    height: '100%',
  },
});
export default Barcode;
