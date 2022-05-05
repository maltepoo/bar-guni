import {ApiInstance, LoginApiInstance} from './instance';
import {Basket} from './basket';

const axios = ApiInstance();

export interface User {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
}
export enum SocialType {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

async function login(type: SocialType, token: string): Promise<User> {
  return (
    await axios.get(
      `/user/oauth-login/${type}/access-token?accessToken=${token}`,
    )
  ).data.data;
}

async function getProfile(): Promise<User> {
  const loginAxios = LoginApiInstance();
  return (await loginAxios.get('/user/')).data.data;
}
async function getBaskets(): Promise<Basket[]> {
  const loginAxios = LoginApiInstance();
  return (await loginAxios.get('/user/basket')).data.data;
}

export {login, getProfile, getBaskets};
