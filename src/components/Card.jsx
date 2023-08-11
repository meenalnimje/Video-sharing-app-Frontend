import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {format} from "timeago.js"
import { axiosClient } from "../utils/axiosClient";
const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({item}) => {
  console.log("item",item);
  const [channel,setChannel]=useState({});
  async function getChannelInfo(){
    const response=await axiosClient.post(`/user/find/userinfo`,{id:item.userId});
    // console.log(`response of channel `,response.result);
    // console.log("result ",response.result);
    setChannel(response.result.user);
  }
  useEffect(()=>{
    getChannelInfo();
  },[item.userId])
  return (
    <Link to={`/video/${item._id}`} style={{ textDecoration: "none" }}>
      <Container type={item.type}>
        <Image
          type={item.type}
          src={item.imgUrl}
        />
        <Details type={item.type}>
          <ChannelImage
            type={item.type}
            src={channel.image}
          />
          <Texts>
            <Title>{item.title}</Title>
            <ChannelName>{channel.name}</ChannelName>
            <Info>{item.views} • {format(item.createdAt)}</Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
