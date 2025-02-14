import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Axios is a popular library for making HTTP requests
import { Link, useNavigate } from 'react-router-dom';
import "../src/App.css";
import { useContext } from "react";
import { UserContext } from "./assets/UserContext";

export default function MainActual () {
  
    const { position, setPosition } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
  
  
    const navigate = useNavigate();


      // --------------------------------------------------------
  
  
      useEffect(() => {
    
        const fetchData = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:3000/');
                setPosts(postsResponse.data);
    
                const commentsResponse = await axios.get('http://localhost:3000/comments');
                setComments(commentsResponse.data);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };
    
        fetchData();
    }, []);
    

    const postsWithComments = posts.map(post => {
      return {
        ...post, 
        comments: comments 
          .filter(comment => comment.postId === post.id)    
          .map(comment => ({  
            ...comment,
            userImgUrl: comment.user?.imgUrl, 
            username: comment.user?.username 
          }))
      };
    });
  
    // -----------------------------------------
  
    // ---------
    const refreshPage = () => {
      window.location.reload();
    };
  

    const ScrollToTopButton = () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth', 
          });
        };

//----------------------------------------------------------------



    return (
        <html>
            <body className="bg-white text-[#111111] w-full h-full font-inter font-semibold overflow-hidden">
            <div className="w-screen h-screen ">
                    {/* ------------------------------------------------ */}
                    <div className="h-[29px]  ">                    </div>
                        <div className="w-full h-[46px] pl-[31px] pr-[44px] flex justify-between items-center "> 
                        <h1 className="underline text-[56px] z-50"> Latest updates </h1>
                        <div className="w-[584px]  h-3"></div>
                            </div>
                            <div className="h-[43px] "></div>
                            <div className="h-[554px]  ml-[31px] mr-[44px] flex flex-col relative font-inter">
                                { postsWithComments.slice(0,2).map(post => (
<div key={post.id}>
<div  className="w-full h-[243px] bg-[#0900FF] border-black pl-[76px] pr-[28px] pb-[27px] pt-[16px] flex">
                                    <div className='bg-gray-400 max-w-[328px] h-[201px]'>
                                        <img src={post.imgUrl} className='w-[449px] h-[201px] object-cover' />
                                    </div>
                                    <div className='w-[52px] h-full '></div>
                                    <div className='w-full h-full  flex flex-col'>
                                        <div className='h-[50px] w-full flex justify-between items-center pr-1 text-white'>
                                            <h1 className='text-[36px] '>{post.title} </h1>
                                            <div className='flex gap-x-1'>
                                                <div className='bg-white h-[27px] w-[27px] rounded-full '>
                                                    <img src={post.user.imgUrl}  className=' h-[27px] w-[27px] rounded-full'/>
                                                </div>
                                                <h1>{post.user.username} </h1>
                                            </div>
                                        </div>
                                        <div className='h-3  w-full '></div>
                                        <div className='h-[92px] w-full '>
                                            <h1 className='text-white text-[24px] font-normal '> {post.postDescription.slice(0, 150)+"...." } </h1>
                                        </div>
                                        <div className=' w-full h-full flex justify-between items-end'>
                                            <h1 className='text-[16px] font-semibold text-white '> {post.addedAt} </h1>
                                                <Link to={`/${post.id}`}> <h1 className='text-[24px] font-normal text-white underline '>Read more</h1> </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='h-[9px] w-full bg-white '></div>
</div>
                            ))}
                            <h1 className='underline text-[41px] w-full border-2 flex justify-center'><Link to="/showMore" className='' >Show more</Link></h1>
                                <h1 className="absolute bottom-0 right-0 underline text-[41px] "> <button className='underline' onClick={ScrollToTopButton}>Home </button> </h1>
                            </div>
                    {/* ------------------------------------------------ */}
                </div>
            </body>
        </html>
    );
};