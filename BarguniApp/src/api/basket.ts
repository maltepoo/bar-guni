import {LoginApiInstance} from './instance';

export interface Basket {
  itemId: number;
  name: string;
  regDate: Date;
  alertBy: string;
  shelfLife: Date;
  usedDate: Date;
  category: string;
  content: string;
  pictureUrl: string;
  dday: number;
}

async function getBaskets(basketId: number): Promise<Basket[]> {
  const axios = LoginApiInstance();
  return (await axios.get(`/item/list/${basketId}`)).data;
}

export {getBaskets};
