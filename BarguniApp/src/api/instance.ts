import axios, {AxiosInstance} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import {User} from './user';
// import EncryptedStorage from 'react-native-encrypted-storage';

let jwtToken = '';
let jwtRefreshToken = '';

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
function setJwtToken(token: string) {
  jwtToken = token;
}

function setRefreshToken(token: string) {
  jwtRefreshToken = token;
}

function LoginApiInstance(): AxiosInstance {
  // const jwtToken = EncryptedStorage.getItem('accessToken');
  console.log(Config.API_URL);
  const instance = axios.create({
    baseURL: Config.API_URL,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  instance.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.data.code === 'J003') {
        // console.log('토큰 유효기간 만료');
        const config = {...error.config};
        console.log('토큰 유효기간 만료 2');
        config.headers.REFRESH = jwtRefreshToken;
        const data: User = (await instance.request(config)).data.data;
        console.log('토큰 유효기간 만료2');
        await EncryptedStorage.setItem('accessToken', data.accessToken);
        await EncryptedStorage.setItem('refreshToken', data.refreshToken);
        console.log('토큰 유효기간 만료3');
        error.config.headers.Authorization = `Bearer ${jwtToken}`;
        console.log('토큰 재 발급 과정 종료');
        return (await instance.request(error.config)).data;
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

export {ApiInstance, setJwtToken, LoginApiInstance};
