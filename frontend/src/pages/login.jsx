import React, { useState } from 'react'
import logo from "../images/logoShortBlack.png"
import { Link } from "react-router-dom"
import rightIMG from "../images/signUpRight.png"
import { api_base_url } from '../helper'
import { useNavigate } from "react-router-dom"

const Loign = () => {

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate()

  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    fetch(api_base_url + "/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: pwd
      })
    }).then(res => res.json()).then(data => {
      if (data.success == false) {
        setError(data.msg)
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("isLoggedIn", true);
        navigate("/");
      }
    })
  }

  return (
    <>
      <div className="container bg-[#FFFFFF] w-screen h-screen flex items-center justify-between px-[150px] pr-0">
        <form onSubmit={submit} action="">
          <img className='w-[150px] mb-[45px]' src={logo} alt="" />

          <div className="inputBox mt-4">
            <input required onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" className='w-[27vw]' placeholder='Email' name='email' id='email' />
          </div>

          <div className="inputBox mt-4">
            <input required onChange={(e) => { setPwd(e.target.value) }} value={pwd} type="password" className='w-[27vw]' placeholder='Password' name='password' id='password' />
          </div>

          <p className='mt-3 mb-3'>Don't Have An Account <Link className='text-[#3797EF]' to="/signUp">Sign Up</Link></p>

          <p className='text-red-500 text-[14px]'>{error}</p>

          <button className="btnBlue w-[27vw] mt-[20px]">Login</button>
        </form>
        <div className="right">
          <img className='w-[55vw] object-cover h-[100vh]' src={rightIMG} alt="" />
        </div>
      </div>
    </>
  )
}

export default Loign