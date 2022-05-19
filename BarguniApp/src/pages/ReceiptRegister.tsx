import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import {fileApiInstance} from '../api/instance';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';
import {Snackbar} from 'react-native-paper';

function ReceiptRegister({route}) {
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isShown, setIsShown] = useState(false);
  const onResponse = useCallback(async response => {
    console.log(response.width, response.height, response.exif, 'response!!');
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      response.width,
      response.height,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      setIsShown(true);
      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
      setIsShown(false);
    });
  }, []);
  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onSubmit = useCallback(async () => {
    console.log('click');
    // const start_time = new Date();
    try {
      if (image) {
        const formData = new FormData();
        // console.log('clova start');
        setIsShown(true);
        formData.append('receipt', image);
        try {
          const axios = fileApiInstance();
          const res = await axios.post('/item/receipt', formData);
          setIsShown(false);
          // console.log(res);
          // console.log(new Date().getTime() - start_time.getTime());
          navigation.navigate('RegisterList', res.data.data);
        } catch (e) {
          console.log(e, 'api 에러');
        }
      } else {
        Alert.alert('사진이 없습니다.', '영수증 사진을 등록해주세요');
      }
    } catch (e) {
      console.log(e);
    }
  }, [image, navigation]);

  return (
    <View style={Style.background}>
      {isShown ? (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          style={{marginTop: 5}}
        />
      ) : (
        <></>
      )}

      <View style={Style.preview}>
        {preview && (
          <ImageBackground style={Style.previewImage} source={preview} />
        )}
      </View>
      <View style={Style.row}>
        <Pressable style={Style.imageButton} onPress={onTakePhoto}>
          <Text style={Style.imageText}>이미지 촬영</Text>
        </Pressable>
        <Pressable style={Style.imageButton} onPress={onChangeFile}>
          <Text style={Style.imageText}>이미지 선택</Text>
        </Pressable>
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={Style.imageButton} onPress={onSubmit}>
          <Text style={Style.imageText}>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const Style = StyleSheet.create({
  background: {flex: 1, backgroundColor: 'white'},
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 1.3,
    backgroundColor: '#D2D2D2',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    marginLeft: '15%',
  },
  previewImage: {
    height: Dimensions.get('window').height / 1.3,
    resizeMode: 'cover',
  },
  imageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: '#0094FF',
    borderRadius: 5,
    marginRight: 10,
    marginTop: 10,
  },
  imageText: {
    color: 'white',
    fontFamily: 'Pretendard-Light',
  },
});

export default ReceiptRegister;
