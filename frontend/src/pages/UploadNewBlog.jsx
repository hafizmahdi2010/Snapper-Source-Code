import Navbar from '../components/Navbar';
import uploadIMG from '../images/Upload-PNG-Image-File.png';
import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-pro-react';
import rightImg from "../images/upload.png";
import { api_base_url } from '../helper';
import { useNavigate } from "react-router-dom";

const UploadNewBlog = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null); // Set initial state to null for the file
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const createBlog = (e) => {
    console.log("Called");
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("image", image); // Append the actual file, not the URL
    formData.append("content", content);
    formData.append("userId", localStorage.getItem("userId"));
    console.log(formData);

    fetch(api_base_url + "/createBlog", {
      mode: "cors",
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === false) {
          setError(data.msg);
        } else {
          alert("Blog created successfully");
          navigate("/");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const realInput = document.getElementById('realInput');
    const mainImgCon = document.querySelector('.mainImgCon');

    const handleMainImgClick = () => {
      realInput.click();
    };

    const handleImageChange = (e) => {
      const imageFile = e.target.files[0];
      if (imageFile) {
        const imageURL = URL.createObjectURL(imageFile);
        const renderImg = document.getElementById('renderImg');
        const uploadCon = document.querySelector('.uploadCon');
        renderImg.src = imageURL;
        setImage(imageFile); // Set the actual file here
        uploadCon.style.display = 'none';
      }
    };

    mainImgCon.addEventListener('click', handleMainImgClick);
    realInput.addEventListener('change', handleImageChange);

    return () => {
      mainImgCon.removeEventListener('click', handleMainImgClick);
      realInput.removeEventListener('change', handleImageChange);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex mt-[20px] px-[150px]">
        <div className="left">
          <h3 className="text-2xl">Upload New Blog</h3>
          <form onSubmit={createBlog} className="py-[3px]">
            <div className="inputBox mt-3">
              <input
                type="text"
                className="w-[40vw]"
                placeholder="Blog title"
                required
                onChange={(e) => { setTitle(e.target.value); }}
                value={title}
              />
            </div>
            <div className="inputBox mt-3">
              <textarea
                className="w-[40vw]"
                placeholder="Blog description"
                required
                onChange={(e) => { setDesc(e.target.value); }}
                value={desc}
              />
            </div>
            <div className="w-[40vw] overflow-hidden mainImgCon mt-3 h-[230px] bg-[#FAFAFA] border-[.5px] border-[#C8C8C8] flex items-center flex-col justify-center rounded-lg cursor-pointer">
              <input type="file" id="realInput" hidden />
              <img id="renderImg" />
              <div className="uploadCon">
                <img className="w-[170px]" src={uploadIMG} alt="Upload" />
                <p className="my-3">Upload Image png/jpg/jpeg</p>
              </div>
            </div>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onChange={(newContent) => setContent(newContent)}
            />
            <button className="btnBlue my-4 w-[40vw]" type="submit">
              Upload Blog
            </button>
          </form>
        </div>
        <div className="right">
          <img src={rightImg} alt="" />
        </div>
      </div>
    </>
  );
};

export default UploadNewBlog;
