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
  },
  extraReducers: builder => {},
});

export default userSlice;
