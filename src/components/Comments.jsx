import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import styled from "styled-components";
import Comment from "./Comment";
import {axiosClient} from "../utils/axiosClient"
import { setLoading } from "../redux/slice/userSlice";
const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;
const Button=styled.button`
padding: 5px 15px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text};;
  color: ${({ theme }) => theme.text};;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`
const Comments = () => {
  const dispatch=useDispatch();
  const [comments,setComments]=useState([]);
  const[commenttxt,setCommenttxt]=useState("");
  const currVideo=useSelector(state=>state.videoReducer.currVideo);
  const myProfile=useSelector(state=>state.userReducer.myProfile)
  const fetchComments=async()=>{
    try {
      const response=await axiosClient.get(`/comment/${currVideo._id}`);
      setComments(response.result.comment);
    } catch (e) {
      console.log("this error is from comments,",e);
    }
  }
  async function addComment(){
    try {
      dispatch(setLoading(true));
      const response=await axiosClient.post("/comment/",{videoId:currVideo._id,desc:commenttxt});
      console.log("response of comment",response);
    } catch (e) {
      console.log("this error is from addcomments,",e);
    }
    finally{
      dispatch(setLoading(false));
      setCommenttxt(" ");
      fetchComments();
    }
  }
  useEffect(()=>{
    fetchComments();
  },[currVideo])
  return (
    <Container>
      <NewComment>
        <Avatar src={myProfile?.image} />
        <Input placeholder="Add a comment..." onChange={(e)=>setCommenttxt(e.target.value)} />
        <Button onClick={addComment}>Add
        </Button>
      </NewComment>
      {comments.map((item)=><Comment info={item} key={item._id}/>)}
    </Container>
  );
};

export default Comments;
