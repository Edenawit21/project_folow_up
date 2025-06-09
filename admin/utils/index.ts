import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isLoggedIn: boolean; // added for auth
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  isLoggedIn: false, // default: not logged in
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    login: (state) => {
      state.isLoggedIn = true;
    },
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode, login } = globalSlice.actions;
export default globalSlice.reducer;
