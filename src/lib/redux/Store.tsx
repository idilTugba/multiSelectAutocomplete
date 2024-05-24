import { configureStore } from "@reduxjs/toolkit";
import charactersReducer from "./reducers/characterSlice";

const store = configureStore({
  reducer: {
    characters: charactersReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default store;
