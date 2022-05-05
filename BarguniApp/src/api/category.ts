import {LoginApiInstance} from './instance';

export interface Category {
  cateId: number;
  name: string;
}

async function getCategory(basketId: number): Promise<Category[]> {
  const axios = LoginApiInstance();
  return (await axios.get(`/basket/category/${basketId}`)).data.data;
}

export {getCategory};
