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

async function registerItem(
  itemId: number,
  name: string,
  regDate: Date,
  alertBy: string,
  shelfLife: Date,
  usedDate: Date,
  category: string,
  content: string,
  pictureUrl: string,
  dday: number,
): Promise<void> {
  const axios = LoginApiInstance();
  await axios.post('/item', {
    itemId: itemId,
    name: name,
    regDate: regDate,
    alertBy: alertBy,
    shelfLife: shelfLife,
    usedDate: usedDate,
    category: category,
    content: content,
    pictureUrl: pictureUrl,
    dday: dday,
  });
}

export {getItems, registerItem};
