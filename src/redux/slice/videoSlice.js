// this video slice is created becz we don't want to reload the page after clicking the like or dislike to show it's effect

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./userSlice";
const initialState = {
  currVideo: {},
};

export const getVideo = createAsyncThunk(
  "video/find",
  async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post(`/video/find`, body);
      // console.log("response from getvideo slice", response.result.Video);
      return response.result.Video;
    } catch (e) {
      console.log("this error is from getMyProfile userSlice side ", e);
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);
export const like = createAsyncThunk("user/like", async (body, thunkAPI) => {
  try {
    thunkAPI.dispatch(setLoading(true));
    const response = await axiosClient.post(`/user/like`, body);
    return response.result;
  } catch (e) {
    console.log("this error is from like userSlice side ", e);
    return Promise.reject(e);
  } finally {
    thunkAPI.dispatch(setLoading(false));
  }
});
export const dislike = createAsyncThunk(
  "user/dislike",
  async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post(`/user/dislike`, body);
      return response.result;
    } catch (e) {
      console.log("this error is from dislike userSlice side ", e);
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);
export const subscribe = createAsyncThunk(
  "user/sub",
  async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post(`/user/sub`, body);
      // console.log("response of subscribe", response);
      return response.result;
    } catch (e) {
      console.log("this error is from dislike userSlice side ", e);
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);
export const videoSlice = createSlice({
  name: "videoSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getVideo.fulfilled, (state, action) => {
        state.currVideo = action.payload;
      })
      .addCase(like.fulfilled, (state, action) => {
        const index = state.currVideo.likes.indexOf(action.payload);
        if (index !== undefined && index !== -1) {
          state.currVideo.likes.splice(index, 1);
        } else {
          // const idxinDislike = state.currVideo.dislikes.indexOf(action.payload);
          // state.currVideo.dislikes.splice(idxinDislike, 1);
          state.currVideo.likes.push(action.payload);
        }
      })
      .addCase(dislike.fulfilled, (state, action) => {
        const index = state.currVideo.dislikes.indexOf(action.payload);
        if (index !== undefined && index !== -1) {
          state.currVideo.dislikes.splice(index, 1);
        } else {
          // const idxinLikes = state.currVideo.likes.indexOf(action.payload);
          state.currVideo.dislikes.push(action.payload);
          // state.currVideo.likes.splice(idxinLikes, 1);
        }
      });
  },
});
export default videoSlice.reducer;
