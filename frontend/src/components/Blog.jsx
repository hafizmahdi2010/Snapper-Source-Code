import React from 'react'
import {useNavigate} from "react-router-dom"

const Blog = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <>
      <div onClick={()=>{navigate(`/singleBlog/${blog._id}`)}} className="blog mb-3 p-[10px] flex items-center bg-[#FAFAFA] rounded-lg cursor-pointer">
        <img className='w-[170px] rounded-lg' src={blog.image} alt="" />
        <div className='ml-3 w-full relative flex h-[100px]'>
          <div className='w-full'>
            <h3 className='text-[20px] font-bold'>{blog.title}</h3>
            <p className='text-[gray]'>{blog.desc}</p>
          </div>
          <p className='text-[gray] flex  text-[14px] absolute bottom-[10px]'>
            {new Date(blog.uploadedAt).toLocaleDateString()} | {blog.uploadedBy}
          </p>
        </div>
      </div>
    </>
  )
}

export default Blog