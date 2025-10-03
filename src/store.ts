// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import roomsReducer from "./features/roomSlice";

const store = configureStore({ reducer: { rooms: roomsReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
