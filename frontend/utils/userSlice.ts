import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  roles: never[];
  name: string;
  email: string;
  avatar: string;
  loggedIn: boolean;
}

const initialState: UserState = {
  name: "",
  email: "",
  avatar: "",
  loggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload, loggedIn: true };
    },
    logout() {
      return { ...initialState };
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
