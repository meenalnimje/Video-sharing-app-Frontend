import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { axiosClient } from "../utils/axiosClient";
import {useDispatch,useSelector} from "react-redux"
import { getMyProfile } from "../redux/slice/userSlice";
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const Home = (props) => {
  const dispatch=useDispatch();
  const [video,setVideo]=useState([]);
  async function getVideo(){
    const response=await axiosClient.get(`/video/${props.type}`);
    // console.log("result ",response.result);
    setVideo(response.result.Video);
  }
  useEffect(()=>{
    getVideo();
  },[props.type])
  useEffect(()=>{
    dispatch(getMyProfile());
  },[])
  // const myProfile=useSelector(state=>state.userReducer.myProfile);
  // console.log("logging my profile from home.jsx",myProfile);
  return (
    <Container>
      {video?.map((item)=>(<Card key={item._id} item={item}/>))}
    </Container>
  );
};

export default Home;
