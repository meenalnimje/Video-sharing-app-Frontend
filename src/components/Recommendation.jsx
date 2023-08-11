import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { axiosClient } from '../utils/axiosClient';
import Card from './Card';
const Container = styled.div`
  flex: 2;
`;
function Recommendation({tags}) {
    const [videos,setVideos]=useState([]);
    const fetchVideos=async()=>{
        const response=await axiosClient.get(`/video/tags?tags=${tags}`)
        setVideos(response.result.tagVideo);
    }
    useEffect(()=>{
        fetchVideos();
    },[tags])
  return (
    <Container>
        {videos.map(item=>(<Card type="sm" key={item._id} item={item}/>))}
    </Container>
  )
}

export default Recommendation