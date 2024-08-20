import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import deleteImg from "../images/deleteIcon.png";
import editImg from "../images/editIcon.png";
import deleteBigImg from "../images/delete.png";
import { api_base_url } from '../helper';
import parse from 'html-react-parser';


const SingleBlog = () => {
  const [data, setData] = useState(null);
  let { id } = useParams();
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);

  const navigate = useNavigate()

  const deleteBlog = (blogId) => {
    console.log("called")
    fetch(api_base_url + "/deleteBlog", {
      mode: "cors",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        blogId: blogId,
        userId: localStorage.getItem("userId")
      })
    }).then(res=>res.json()).then(data=>{
      if(data.success){
        setIsDeleteModelShow(false);
        navigate("/");
      }
      else{
        alert(data.msg)
      }
    })
  }

  useEffect(() => {
    fetch(api_base_url + "/getBlog", {
      mode: "cors",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        blogId: id
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.blog);
        if (data.success && data.blog.length > 0) {
          setData(data.blog[0]); // Access the first item in the array
        } else {
          console.error("No blog data found");
        }
      })
      .catch(err => console.error("Error fetching blog data:", err));
  }, [id]);

  return (
    <>
      <Navbar />
      <div className='px-[150px]'>
        <img className='w-[100%] h-[70vh] rounded-xl mb-3' src={data ? data.image : ""} alt="Blog Image" />
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-2xl font-bold'>{data ? data.title : "Loading..."}</h3>
          </div>
          {

            data ? data.userId === localStorage.getItem("userId") ?
              <div className="btns flex items-center gap-2">
                <button onClick={() => setIsDeleteModelShow(true)} className='flex items-center gap-[5px] rounded-[30px] p-[10px] border-[1px] border-[#F44336]'>
                  <img className='w-[25px]' src={deleteImg} alt="Delete Icon" /> Delete
                </button>
                <button onClick={()=>{navigate(`/editBlog/${id}`)}} className='flex items-center gap-[5px] rounded-[30px] p-[10px] border-[1px] border-[#4A88DA]'>
                  <img className='w-[25px]' src={editImg} alt="Edit Icon" /> Edit
                </button>
              </div> : "" : ""
          }
        </div>
        <p className='text-[gray]'>{data ? data.desc : "Loading..."}</p>
        <p className='text-[gray]'>{data ? new Date(data.date).toDateString() : "Loading..."} | {data ? data.uploadedBy : "Loading..."}</p>
      </div>

      <div className='px-[150px] mt-3'>
        {parse(data ? data.content : "")}
      </div>


      {isDeleteModelShow && (
        <div className="modelCon fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.5)] flex items-center justify-center">
          <div className="model w-[32vw] h-[auto] p-[20px] bg-white rounded-xl">
            <div className='flex items-center gap-[10px]'>
              <img src={deleteBigImg} className='w-[150px]' alt="Delete Confirmation" />
              <div className='relative h-[120px]'>
                <h3 className='text-2xl'>Do you want to delete this <br /> blog "{data ? data.title : "this blog"}"?</h3>
                <p className='text-[gray] absolute bottom-0'>Delete/Cancel</p>
              </div>
            </div>
            {
              console.log("Check : ", localStorage.getItem("userId") === data.userId)
            }


            <div className="btns mt-3 flex items-center gap-2">
              <button onClick={()=>{deleteBlog(data._id)}} className='p-[10px] text-white bg-[#F44336] min-w-[49%] rounded-lg cursor-pointer border-0 transition-all hover:bg-red-600'>
                Delete
              </button>
              <button onClick={() => setIsDeleteModelShow(false)} className='p-[10px] text-black bg-[#D1D5DB] min-w-[49%] rounded-lg cursor-pointer border-0 transition-all hover:bg-[#c4c6ca]'>
                Cancel
              </button>
            </div>



          </div>
        </div>
      )}
    </>
  );
}

export default SingleBlog;
