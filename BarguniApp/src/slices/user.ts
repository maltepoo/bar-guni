import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  defaultBasket: {
    name: '',
    profileUrl: '',
    joinCode: '',
  },
  selectBasket: {
    id: 0,
    user_id: 0,
    bkt_id: 0,
    authority: '',
    bkt_name: '',
    count: 0,
  },
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
      state.defaultBasket = action.payload.defaultBasket;
    },
    setUserName(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    setUserWithoutToken(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.defaultBasket = action.payload.defaultBasket;
    },
    setSelectBasket(state, action) {
      console.log(action.payload, 'payLoad');
      state.selectBasket = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
