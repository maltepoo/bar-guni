import {LoginApiInstance} from './instance';

export interface Basket {
  id: number;
  user_id: number;
  bkt_id: number;
  authority: string;
  bkt_name: string;
  count: number;
}

export interface DefaultBasket {
  name: string;
  profileUrl: string;
  joinCode: string;
}

export interface AlarmI {
  id: number;
  basketId: number;
  itemId: number;
  basketName: string;
  itemName: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}
export interface Response<T> {
  message: string;
  data: T | T[];
}

async function registerBasket(
  basketName: string,
  basketImg?: string,
): Promise<void> {
  const axios = LoginApiInstance();
  await axios.post(`/basket/?name=${encodeURI(basketName)}`, {
    basketImg: basketImg,
  });
}

async function getBasketInfo(basketId: number) {
  const axios = LoginApiInstance();
  return (await axios.get(`/basket/${basketId}`)).data.data;
}

async function updateBasketName(basketId: number, basketName: string) {
  const axios = LoginApiInstance();
  await axios.put(`/basket/${basketId}?name=${basketName}`);
}

async function deleteBasket(basketId: number) {
  const axios = LoginApiInstance();
  return (await axios.delete(`/basket/${basketId}`)).data.data;
}

async function getBasketMembers(basketId: number) {
  const axios = LoginApiInstance();
  return (await axios.get(`/basket/user/${basketId}`)).data.data;
}

async function joinBasket(joinCode: string) {
  const axios = LoginApiInstance();
  return (await axios.post(`/user/basket?joinCode=${joinCode}`)).data.data;
}

async function getAlarms(): Promise<AlarmI[]> {
  const axios = LoginApiInstance();
  return (await axios.get('/alert')).data.data;
}
async function changeAlarm(id: number) {
  const axios = LoginApiInstance();
  return (await axios.put(`/alert/${id}?alertStatus=CHECKED`)).data.data;
}
async function deleteAlarm(id: number) {
  const axios = LoginApiInstance();
  return (await axios.delete(`/alert/${id}`)).data.data;
}

export {
  changeAlarm,
  deleteAlarm,
  registerBasket,
  getBasketInfo,
  updateBasketName,
  deleteBasket,
  getBasketMembers,
  getAlarms,
  joinBasket,
};
