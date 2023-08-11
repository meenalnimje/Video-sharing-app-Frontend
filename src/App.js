import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import RequireUser from "./components/RequireUser";
import LoadingBar from "react-top-loading-bar";
import IfnotLogin from "./components/IfnotLogin";
import Search from "./pages/Search";
const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;
const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App() {
  const isLoading = useSelector((state) => state.userReducer.isLoading);
  const [darkMode, setDarkMode] = useState(true);
  const loadingRef = useRef(null);
  useEffect(() => {
    if (isLoading) {
      loadingRef.current?.continuousStart();
    } else {
      loadingRef.current?.complete();
    }
  }, [isLoading]);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <LoadingBar color="#5f9fff" ref={loadingRef} />
            <Navbar />
            <Wrapper>
              <Routes>
                <Route element={<RequireUser />}>
                  <Route path="/" element={<Home type="random" />} />
                  <Route path="/trends" element={<Home type="trends" />} />
                  <Route path="/subscription" element={<Home type="sub" />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                  <Route path="/search" element={<Search />} />
                </Route>
                <Route element={<IfnotLogin />}>
                  <Route path="/signin" element={<SignIn />} />
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
