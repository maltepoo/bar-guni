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
  barcode: number;
}

export interface ItemReq {
  bktId: number;
  picId: number | null;
  cateId: number;
  name: string;
  alertBy: string;
  shelfLife?: string;
  content: string;
  dday: number | null;
}

async function getItems(basketId: number): Promise<Item[]> {
  const axios = LoginApiInstance();
  return (await axios.get(`/item/list/${basketId}`)).data.data;
}

async function registerItem(item: ItemReq): Promise<void> {
  const axios = LoginApiInstance();
  await axios.post('/item', JSON.stringify(item));
}

async function barcodeItemInfo(barcode: number): Promise<Item> {
  const axios = LoginApiInstance();
  return await axios.get(`/prod?barcode=${barcode}`);
}

export {getItems, barcodeItemInfo, registerItem};
