import {ApiInstance, LoginApiInstance} from './instance';
import {Basket, DefaultBasket} from './basket';

const axios = ApiInstance();

export interface User {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  defaultBasket: DefaultBasket;
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
  return (await loginAxios.get('/user')).data.data;
}

async function changeName(newName: string): Promise<User> {
  const loginAxios = LoginApiInstance();
  return (await loginAxios.put(`/user?name=${newName}`)).data.data;
}

async function signOut(): Promise<User> {
  const loginAxios = LoginApiInstance();
  return (await loginAxios.delete(`/user`)).data.data;
}

async function getBaskets(): Promise<Basket[]> {
  const loginAxios = LoginApiInstance();
  return (await loginAxios.get('/user/basket')).data.data;
}

async function changeDefaultBasket(id: number) {
  console.log(id, 'api ID');
  const loginAxios = LoginApiInstance();
  return (await loginAxios.put(`/user/basket/default/${id}`)).data.data;
}

export {
  login,
  changeDefaultBasket,
  getProfile,
  changeName,
  signOut,
  getBaskets,
};
