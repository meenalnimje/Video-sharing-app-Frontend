import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { KEY_ACCESS_TOKEN,getItem,removeItem } from "../utils/localStorageManager";
import {AiOutlineLogout} from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/slice/userSlice";
import { axiosClient } from "../utils/axiosClient";
import { Avatar } from "@mui/material";
import Upload from "./Upload";
const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;
const Profile=styled.img`
  width:32px;
  height:32px;
  border-radius:50%;
  background-color:#999
`;
const User=styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:500;
  color: ${({ theme }) => theme.text};
  cursor:pointer;
`;
const Navbar = () => {
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const user=getItem(KEY_ACCESS_TOKEN);
  const myProfile=useSelector(state=>state.userReducer.myProfile);
  async function handleLogout() {
  try {
    dispatch(setLoading(true));
    await axiosClient.post("/auth/logout");
    removeItem(KEY_ACCESS_TOKEN);
    navigate("/signin");
    dispatch(setLoading(false));
  } catch (e) {
    console.log("this error is from logout navbar side ", e);
  }
}
  return (
    <>
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" onChange={(e)=>setQ(e.target.value)} />
          <SearchOutlinedIcon onClick={()=>navigate(`/search?q=${q}`)}/>
        </Search>
        {user?
        <User>
          <VideoCallOutlinedIcon onClick={()=>setOpen(true)}/>
          <Profile src={myProfile?.image}/>
          {myProfile?.name}
          <Button onClick={handleLogout}>
            < AiOutlineLogout/>
            Logout
          </Button>
        </User>
        :<Link to="signin" style={{ textDecoration: "none" }}>
          <Button>
            <AccountCircleOutlinedIcon />
            SIGN IN
          </Button>
        </Link>}
      </Wrapper>
    </Container>
    {open && <Upload setOpen={setOpen}/>}
    </>
  );
};

export default Navbar;
