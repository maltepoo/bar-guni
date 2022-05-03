import axios, {AxiosInstance} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
// import EncryptedStorage from 'react-native-encrypted-storage';

function ApiInstance(): AxiosInstance {
  console.log(Config.API_URL, 'instance');
  const instance = axios.create({
    baseURL: Config.API_URL,
    headers: {
      'Content-type': 'application/json',
    },
  });
  return instance;
}
function LoginApiInstance(): AxiosInstance {
  // const jwtToken = EncryptedStorage.getItem('accessToken');
  const jwtToken = useSelector((state: RootState) => state.user.accessToken);
  const instance = axios.create({
    baseURL: Config.API_URL,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  return instance;
}

export {ApiInstance, LoginApiInstance};
