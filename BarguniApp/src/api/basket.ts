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
async function getBaskets2(): Promise<Basket[]> {
  const axios = LoginApiInstance();
  return (
    await axios.post(`item/`, {
      bktId: 0,
      picId: 0,
      cateId: 0,
      name: 'string',
      alertBy: 'D_DAY',
      shelfLife: '2022-05-04',
      content: 'string',
      dday: 0,
    })
  ).data;
}

export {getBaskets, getBaskets2};
