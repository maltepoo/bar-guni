import {LoginApiInstance} from './instance';

export interface Item {
  itemId: number;
  name: string;
  regDate: string;
  alertBy: string;
  shelfLife: string;
  usedDate: string;
  category: string;
  content: string;
  pictureUrl: string;
  dday: number;
  barcode: number;
  used: boolean;
}

export interface ItemReq {
  bktId: number;
  picId: number | null;
  cateId: number;
  name: string;
  alertBy: string;
  shelfLife?: string;
  content: string;
  dday?: number;
}

async function getItems(basketId: number, used?: boolean): Promise<Item[]> {
  const axios = LoginApiInstance();
  if (used === undefined) {
    return (await axios.get(`/item/list/${basketId}`)).data.data;
  } else {
    return (await axios.get(`/item/list/${basketId}?used=${used}`)).data.data;
  }
}

async function registerItem(item: ItemReq): Promise<void> {
  const axios = LoginApiInstance();
  await axios.post('/item', JSON.stringify(item));
}

async function barcodeItemInfo(barcode: number): Promise<Item> {
  const axios = LoginApiInstance();
  return await axios.get(`/prod?barcode=${barcode}`);
}

async function changeItemStatus(itemId: number, used: boolean): Promise<Item> {
  const loginAxios = LoginApiInstance();
  return (await loginAxios.put(`/item/status/${itemId}/${used}`)).data.data;
}

async function deleteItem(itemId: number): Promise<void> {
  const axios = LoginApiInstance();
  await axios.delete(`/item/${itemId}`);
}

export {getItems, deleteItem, barcodeItemInfo, registerItem, changeItemStatus};
