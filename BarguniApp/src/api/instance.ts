import axios, {AxiosError, AxiosInstance} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import {User} from './user';
// import EncryptedStorage from 'react-native-encrypted-storage';

let jwtToken = '';

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

function LoginApiInstance(): AxiosInstance {
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
        console.log(error, ' 토큰 재발급 에러 처리');
        const request = {...error.request};
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        const token = await EncryptedStorage.getItem('accessToken');

        const config: any = {
          baseURL: request.responseURL,
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
            REFRESH: `Bearer ${refreshToken}` as string | undefined,
          },
          data: error.config.data,
        };
        const res = await instance.request(config);
        console.log(res, '토큰 재발급 res');
        delete config.headers.REFRESH;
        config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
        console.log(config, '바꾼 jwtToken');
        await EncryptedStorage.setItem(
          'accessToken',
          res.data.data.accessToken,
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          res.data.data.refreshToken,
        );
        setJwtToken(res.data.data.accessToken);
        return await instance.request(config);
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

export {ApiInstance, setJwtToken, LoginApiInstance};
