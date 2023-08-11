import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import videoReducer from "./slice/videoSlice";
const store = configureStore({
  reducer: {
    userReducer,
    videoReducer,
  },
});
export default store;
