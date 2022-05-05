import {LoginApiInstance} from './instance';

export interface Item {
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

async function getItems(basketId: number): Promise<Item[]> {
  const axios = LoginApiInstance();
  return (await axios.get(`/item/list/${basketId}`)).data.data;
}

export {getItems};
