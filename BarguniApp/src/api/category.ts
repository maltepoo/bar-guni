import {LoginApiInstance} from './instance';

export interface Category {
  cateId: number;
  name: string;
}

async function getCategory(basketId: number): Promise<Category[]> {
  const axios = LoginApiInstance();
  return (await axios.get(`/basket/category/${basketId}`)).data.data;
}

async function registerCategory(
  basketId: number,
  categoryName: string,
): Promise<Category[]> {
  const axios = LoginApiInstance();
  return (await axios.post(`basket/category/${basketId}?name=${categoryName}`))
    .data.data;
}

async function deleteCategory(categoryId: number) {
  const axios = LoginApiInstance();
  return (await axios.delete(`basket/category/${categoryId}`)).data.data;
}

export {getCategory, registerCategory, deleteCategory};
