import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getUserInfo, setLoading } from "../redux/slice/userSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import {format} from "timeago.js"
import { axiosClient } from "../utils/axiosClient";
const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  `;
  
  const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex:1;
  color: ${({ theme }) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;
const Button=styled.button`
  display:flex;
  background-color: transparent;
  border:none;
  color: red;
  cursor: pointer;
  height:25px;
  // width:30px;
  // display: flex;
  // justify-content:center;
  // align-items: center;

`
const Comment = (props) => {
  console.log("props of commnet",props);
  const dispatch=useDispatch();
  const id=props?.info?.userId;
  const userInfo=useSelector(state=>state.userReducer.userInfo);
  const myProfile=useSelector(state=>state.userReducer.myProfile)
  const currVideo=useSelector(state=>state.videoReducer.currVideo);
  useEffect(()=>{
    dispatch(getUserInfo({id}))
  },[id])
  async function handleDeleteComment(){
    try {
      dispatch(setLoading(true));
      const response=await axiosClient.delete(`/comment/${props?.info?._id}`);
      console.log("response of delete",response);
    } catch (e) {
      console.log("error from delete commnet side",e);
    }
    finally{
      dispatch(setLoading(false));
      window.location.reload(true);
    }
  }
  return (
    <Container>
      <Avatar src={userInfo?.image} />
      <Details>
        <Name>
          {userInfo.name}  <Date>{format(props?.info?.createdAt)}</Date>
        </Name>
        <Text>
          {props?.info?.desc}
        </Text>
      </Details>
      {(props.info.userId===myProfile._id) && <Button onClick={handleDeleteComment}>Remove</Button>}
    </Container>
  );
};

export default Comment;
