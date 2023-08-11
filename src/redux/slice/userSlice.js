import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { subscribe } from "./videoSlice";
const initialState = {
  myProfile: {},
  userInfo: {},
  isLoading: false,
};

export const getMyProfile = createAsyncThunk(
  "user/myProfile",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.get("/user/find/");
      // console.log("response of getMyProfile", response);
      return response.result.user;
    } catch (e) {
      console.log("this error is from getMyProfile userSlice side ", e);
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "user/userProfile",
  async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("/user/find/userinfo", body);
      // console.log("response of userProfile", response);
      return response.result.user;
    } catch (e) {
      console.log("this error is from userprofile userSlice side ", e);
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);
export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(subscribe.fulfilled, (state, action) => {
        const index = state.myProfile.subscribeUsers.includes(action.payload);
        if (index !== -1) {
          state.myProfile.subscribeUsers.splice(index, 1);
        } else {
          state.myProfile.subscribeUsers.push(action.payload);
        }
      });
  },
});
// Action creators are generated for each case reducer function
export default userSlice.reducer;
export const { setLoading } = userSlice.actions;
