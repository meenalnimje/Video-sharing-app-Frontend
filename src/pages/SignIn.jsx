import React, { useState } from "react";
import styled from "styled-components";
import {axiosClient } from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { setItem,KEY_ACCESS_TOKEN } from "../utils/localStorageManager";
import {  auth,provider} from "../firebase";
import { signInWithPopup}  from "firebase/auth"
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;
const SignIn = () => {
  const navigate=useNavigate();
  const[email,setEmail]=useState("");
  const[name,setName]=useState("");
  const[password,setPassword]=useState("");
  async function handleSignIn(e){
    try {
      e.preventDefault();
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      navigate("/");
    } catch (e) {
      console.log("error login frontend ",e);
    }
  }
  async function handleSignUp(e){
    e.preventDefault();
    const response = await axiosClient.post("/auth/signup", {
      name,
      email,
      password,
    });
    // response.result=User registered successfully
    console.log("response",response);
  }
  async function signInThroughGoogle(){
    signInWithPopup(auth,provider).then( async(result)=>{
      // result.user=data
      console.log("result of google",result.user);
      const response=await axiosClient.post("/auth/googlelogin",{
        name:result.user.displayName,
        email:result.user.email,
        img:result.user.photoURL,
      });
      setItem(KEY_ACCESS_TOKEN,response.result.accessToken)
      navigate("/");
    }).catch( (error) =>{
      console.log("google error",error);
    })
  }
  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to LamaTube</SubTitle>
        <Input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
        <Input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
        <Button onClick={handleSignIn}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInThroughGoogle}>Signin with google</Button>
        <Title>or</Title>
        <Input placeholder="username" onChange={e=>setName(e.target.value)}/>
        <Input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
        <Input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
        <Button onClick={handleSignUp}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
