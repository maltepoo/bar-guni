import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
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

function ReceiptRegister(props) {
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const onResponse = useCallback(async response => {
    console.log(response);
    console.log(response.width, response.height, response.exif, 'response!!');
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      response.width,
      response.height,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      0,
      0,
    ).then(r => {
      console.log(r, 'resized');
      console.log(r.uri, r.name);
      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
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
    try {
      console.log(image);
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        try {
          const axios = fileApiInstance();
          const res = await axios.get('/item/receipt');
          console.log(res);
          navigation.navigate('RegisterList', res.data.data);
        } catch (e) {
          console.log(e, 'api 에러');
        }
      } else {
        Alert.alert('사진이 없습니다.', '영수증 사진을 등록해주세요');
      }
    } catch (e) {}
  }, [image, navigation]);

  return (
    <View style={Style.background}>
      <View style={Style.preview}>
        {preview && <Image style={Style.previewImage} source={preview} />}
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
        <TouchableOpacity style={Style.imageButton}>
          <Text style={Style.imageText} onPress={onSubmit}>
            등록
          </Text>
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
  },
});

export default ReceiptRegister;
