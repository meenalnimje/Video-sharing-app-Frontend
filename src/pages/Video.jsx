import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded'; 
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosClient } from "../utils/axiosClient";
import { dislike, getVideo, like, subscribe } from "../redux/slice/videoSlice";
import { format } from "timeago.js";
import { getMyProfile } from "../redux/slice/userSlice";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;
const VideoFrame=styled.video`
max-height:720px;
width:100%;
object-fit:cover;

`
const Video = () => {
  const params=useParams();
  const dispatch=useDispatch();
  const videoId=params.id;
  const [channelInfo,setChannelInfo]=useState({});
  const currVideo=useSelector(state=>state.videoReducer.currVideo);
  const myprofile=useSelector(state=>state.userReducer.myProfile);
  console.log("myprofile",myprofile);
  console.log("cuurVideo",currVideo);
  async function fetchData(){
    try {
      dispatch(getVideo({videoId}));
      const id=currVideo?.userId;
      const channelResponse=await axiosClient.post(`/user/find/userinfo`,{id:id});
      console.log("channelResponse",channelResponse);
      setChannelInfo(channelResponse.result.user);
    } catch (e) {
      console.log("error from fetchdata video.jsx",e);
    }
  }
  async function handleLike(){
    dispatch(like({videoId:currVideo?._id}))
  }
  async function handleDislike(){
   dispatch(dislike({videoId:currVideo?._id}))
  }
  async function handleSubcribe(){
    dispatch(subscribe({idToSubsribe:currVideo.userId}))
  }
  useEffect(()=>{
    dispatch(getMyProfile());
    fetchData();
  },[params.id])
  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currVideo.videoUrl} controls/>
        </VideoWrapper>
        <Title>{currVideo?.title}</Title>
        <Details>
          <Info>{currVideo?.views} views • {format(currVideo?.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currVideo.likes?.includes(myprofile._id)?<ThumbUpAltRoundedIcon/>:<ThumbUpOutlinedIcon/>}
              {currVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currVideo.dislikes?.includes(myprofile._id)?<ThumbDownRoundedIcon/>:<ThumbDownOffAltOutlinedIcon /> }Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channelInfo.image} />
            <ChannelDetail>
              <ChannelName>{channelInfo.name}</ChannelName>
              <ChannelCounter>{channelInfo?.subscribers} subscribers</ChannelCounter>
              <Description>
                {currVideo?.desc}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSubcribe}>{myprofile?.subscribeUsers?.includes(currVideo.userId)?"UNSUBSCRIBE":"SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr />
        <Comments/>
      </Content>
      <Recommendation tags={currVideo.tags}/>
    </Container>
  );
};

export default Video;
