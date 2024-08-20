import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Loign from './pages/login';
import UploadNewBlog from './pages/UploadNewBlog';
import SingleBlog from './pages/SingleBlog';
import EditBlog from './pages/EditBlog';

const App = () => {
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login"/>} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Loign />} />
          <Route path='/uploadNewBlog' element={isLoggedIn ? <UploadNewBlog /> : <Navigate to="/login"/>} />
          <Route path='/singleBlog/:id' element={isLoggedIn ? <SingleBlog /> : <Navigate to="/login"/>} />
          <Route path='/editBlog/:id' element={isLoggedIn ? <EditBlog /> : <Navigate to="/login"/>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App