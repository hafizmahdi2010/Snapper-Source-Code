import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Blog from '../components/Blog'
import { api_base_url } from '../helper'

const Home = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(api_base_url + "/getBlogs", {
      mode: "cors",
      method: "GET",
    }).then(res => res.json()).then(data => {
      setData(data);
    })
  }, [])

  const [userData, setUserData] = useState(null);
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
      setUserData(data.user);
    })
  }, [])
  return (
    <>
      <Navbar />
      <div className='flex mb-[40px] mt-5 h-[70px] px-[150px] items-center justify-between'>
        <h3 className='text-2xl'>Hi, {userData ? userData.name : ""}</h3>

        <div className="inputBox">
          <input type="text" className='w-[27vw]' placeholder='Search Here... !' />
        </div>
      </div>

      <div className="blogs px-[150px]">
        {
          data ?
            data.map((el) => {
              return (
              <>
                <Blog blog={el} />
              </>
              )
            }) : "No Blogs Yet... !"
        }
      </div>
    </>
  )
}

export default Home