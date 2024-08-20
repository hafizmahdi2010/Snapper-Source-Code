import React, { useEffect, useState } from 'react'
import logo from "../images/logoShortBlack.png"
import Avatar from 'react-avatar';
import {api_base_url} from "../helper"

const Navbar = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(api_base_url + '/getUser', {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }
    ).then(res=>res.json()).then(data=>{
      setData(data.user);
    })
  }, [])

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  }
  
  return (
    <>
      <div className="navbar h-[100px] px-[150px] bg-[#FAFAFA] flex items-center justify-between">
        <img className='w-[120px]' src={logo} alt="" />
        <div className='flex items-center gap-2'>
        <button className='p-[10px] bg-red-500 transition-all hover:bg-red-600 text-white rounded-[5px] cursor-pointer' onClick={logout}>Logout</button>
        <Avatar round="50%" className=' cursor-pointer' name={data ? data.name : ""} size="45" />
        </div>
      </div>
    </>
  )
}

export default Navbar