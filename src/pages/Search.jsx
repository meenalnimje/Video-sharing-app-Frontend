import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { axiosClient } from '../utils/axiosClient';
import { useLocation, useParams } from 'react-router-dom';
import Card from "../components/Card"
const Container=styled.div`
display:flex;
flex-wrap:wrap;
gap:10px;
`
function Search() {
    const [videos,setVideos]=useState([]);
    const query=useLocation().search;
    const finalquery=query.split("=");
    async function fetchVideos(){
        const response=await axiosClient.get(`/video/search?q=${finalquery[1]}`);
        setVideos(response.result.searchvideo)
    }
    useEffect(()=>{
        fetchVideos();
    },[query])
  return (
    <Container>
        {videos.map(item=><Card item={item}/>)}
    </Container>
  )
}

export default Search