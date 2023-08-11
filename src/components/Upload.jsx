import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { axiosClient } from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  background-color:#000000a7;
  display:flex;
  align-items:center;
  justify-content:center;

`;
const Wrapper = styled.div`
  width:600px;
  height:600px;
  background-color:${({ theme }) => theme.bgLighter};
  color:${({ theme }) => theme.text};
  padding:20px;
  display:flex;
  flex-direction:column;
  gap:20px;
  position:relative;
`;
const Close = styled.div`
  position:absolute;
  top:10px;
  right:10px;
  cursor:pointer;
`;
const Title = styled.h1`
  text-align:center;
  margin-top:20px;
`;
const Input = styled.input`
  border:1px solid ${({ theme }) => theme.soft};
  color:${({ theme }) => theme.text};
  border-radius:3px;
  padding:10px;
  background-color:transparent;
`;
const Desc = styled.textarea`
  border:1px solid ${({ theme }) => theme.soft};
  color:${({ theme }) => theme.text};
  border-radius:3px;
  padding:10px;
  background-color:transparent;
  `;
const Button = styled.button`
  border-radius:3px;
  border:none;
  padding:10px 20px;
  font-weight:500;
  cursor:pointer;
  background-color:${({ theme }) => theme.soft};
  color:${({ theme }) => theme.text};
`;
const Label = styled.label`
  font-size:14px;
`;
function Upload({ setOpen }) {
  // the container is of full screen size
  const navigate = useNavigate();
  const [image, setImage] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  // inputs will have imageUrl,videoUrl,title,desc
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [videoPercentage, setVideoPercentage] = useState(0);

  function handleChange(e) {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }
  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };
  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImagePercentage(Math.round(progress))
          : setVideoPercentage(Math.round(progress));
        // console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };
  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);
  useEffect(() => {
    image && uploadFile(image, "imgUrl");
  }, [image]);
  const handleUpload = async (e) => {
    e.preventDefault();
    const response = await axiosClient.post("/video/", { ...inputs, tags });
    setOpen(false);
    response.statusCode === 200 &&
      navigate(`/video/${response.result.savedVideo._id}`);
  };
  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a new video</Title>
        <Label>Video:</Label>
        {videoPercentage > 0 ? (
          "Uploading..." + videoPercentage + "%"
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          name="desc"
          rows={8}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        <Label>Image:</Label>
        {imagePercentage > 0 ? (
          "Uploading..." + imagePercentage + "%"
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        )}
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
}

export default Upload;
