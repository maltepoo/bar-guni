import {ApiInstance} from './instance';

const axios = ApiInstance();

export interface User {
  accessToken: string;
  refreshToken: string;
}
export enum SocialType {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

async function login(type: SocialType, token: string): Promise<User> {
  return (
    await axios.get(
      `/user/oauth-login/${type}/access-token?accessToken=${token}`,
    )
  ).data.data;
}

export {login};
