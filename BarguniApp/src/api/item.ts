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

async function registerItem(): Promise<void> {
  const axios = LoginApiInstance();
  await axios.post('/item', {
    bktId: 0,
    picId: 0,
    cateId: 0,
    name: 'string',
    alertBy: 'D_DAY',
    shelfLife: '2022-05-06',
    content: 'string',
    dday: 0,
  });
}

export {getItems, registerItem};
