import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// Axios is a popular library for making HTTP requests
import { Link } from 'react-router-dom';
import "../src/App.css";
import { UserContext } from "./assets/UserContext";
import CreateNews from './CreateNews';
import CreateArticles from './createArticles';
import ShowNews from './ShowNews';
import ShowArticles from './ShowArticles';
import ShowComments from './ShowComments';
import ShowUsers from './ShowUsers';
import ShowUserArticles from './ShowUserArticles';

export default function DashboardActual () {
  const [isClicked, setIsClicked] = useState({});

    const [editVisible, setEditVisible] = useState([]);
    const [ posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
  
    const { user, saveVisible, setUser, setSaveVisible } = useContext(UserContext);
  
    // const [description, setDescription] = useState('');
    const [visibleButtons, setVisibleButtons] = useState([]);
  
    const [isVisible, setIsVisible] = useState(false);
  
    const [isPublished, setIsPublished] = useState(false);


    function handleClick(id) {
      setIsClicked({ [id] : true});
      localStorage.setItem('savedButton', id);
    };

    useEffect(() => {
      const savedButton = localStorage.getItem('savedButton');
            
      if (savedButton) {
        setIsClicked({ [savedButton]: true });
      } else {
        if (user.id == 1) {
          handleClick(2);  
        } else {
          handleClick(0);  
        }
      }





      // ----------
      if (user) {
        fetch('http://localhost:3000/posts', {
           headers: {
              Authorization: `Bearer ${user.token}`,
           },
        })
           .then(response => response.json())
           .then(data => setPosts(data))
           .catch(error => console.error('Error fetching posts:', error));
     }
  
            // ----------
        
    }, [user]);
  
    const handleEditVisible = (index) => {
      setEditVisible((prevVisible) => {
        const newVisible = [...prevVisible];
        newVisible[index] = !newVisible[index]; 
        return newVisible;
      });
    };
    console.log("edit",editVisible);
  

    const postsWithComments = posts.map(post => {
      return {
        ...post,  // create new object (post)
        comments: comments // adding property (comments)
          .filter(comment => comment.postId === post.id)    // filtering its own comments
          .map(comment => ({  // mapping its own comments
            ...comment,
            userImgUrl: comment.user?.imgUrl, 
            username: comment.user?.username 
          }))
      };
    });
    // ----------------------------------------------------------------
    const handlePublished = (post) => {
      alert('Published');
    };
  
    const handleUnpublished = (post) => {
      alert('Unpublished');
    };
  
    // -----------------------------------
  
    useEffect(() => {
      console.log('User:', user); // Log user
    }, [user]);
  
  
    const userComments = user && comments.length > 0
      ? comments.filter(comment => parseInt(comment.userId) === parseInt(user.id))
      : [];
  
      console.log('User comments:', userComments); // Log user comments
  
  
    // -----------------------------------
  
  const handleVisible = (index) => {
    setVisibleButtons((prevVisibleButtons) => {
      const newVisibleButtons = [...prevVisibleButtons];
      newVisibleButtons[index] = !newVisibleButtons[index];
      return newVisibleButtons;
    });
  };

  
  
  // ----------------

  
  // -----------
  const handleVisibleNewPost = () => {
    setIsVisible(!isVisible);
  };
  
  const postPost = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const dataEntries = Object.fromEntries(data.entries());
    const dataJson = JSON.stringify({
      ...dataEntries,
    });
  
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Send JWT token for authentication
        },
        body: dataJson,
      });
  
      const result = await response.json();
      if (response.ok) {
        const newPost = {
          ...result, // Post data from server
        };
  
        // Update the posts state to reflect the new post
        setPosts([...posts, newPost]);
      } else {
        console.log("Error posting post:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  
    window.location.reload();
  };
  
  
  const handleCheckboxChange = (e) => {
    setIsPublished(e.target.checked);
  };
  
  
  
  // ----------------------------------------------------------------
  async function handleUpdatePost(e, post) {
    e.preventDefault();
  
    const postId = post.id;
  
    const dataJson = JSON.stringify({
      isPublished: !post.isPublished, // Toggle the current state of isPublished
    });
  
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: dataJson,
      });
  
      const result = await response.json();
      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId ? { ...p, isPublished: !post.isPublished } : p
          )
        );
      } else {
        console.log("Error updating post:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  ///-------
  function removeToken() {
    setUser(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("savedButton")
    window.location.href = "/";
  }
  

  

    return (
        <html>
            <body className="bg-white text-[#111111] w-full h-full font-roboto font-semibold overflow-x-hidden  relative">
            <div className="w-screen h-screen ">
                    {/* ------------------------------------------------ */}
                    <div className="h-[49px]  ">                    </div>
                        <div className="w-full h-[46px] pl-[31px] pr-[44px] flex justify-between items-center "> 
                            <h1 className="text-[40px]">Welcome, {user.username} </h1>
                            <div className="w-[584px]  h-3"></div>
                            <div className="flex items-center gap-x-[8px] ">
                                <h1 className="text-[36px] "><Link to="/">Home</Link> </h1>
                                <img src="./arrow_black.png" className="" />
                                <h1 className="text-[36px] text-[#0E57F3]"><Link to="/dashboard">Dashboard</Link> </h1>
                                <img src="./arrow_blue.png" className="" />
                                <h1 className="text-[36px] "><button onClick={removeToken}>Log-out</button></h1>
                                <img src="./arrow_black.png" className="" />
                            </div>
                            </div>
                            <div className="h-[217px] w-full flex flex-col ">
                              <div className='h-[160px] w-full '></div>
                              <div className=' w-full h-[170px] flex items-end justify-center'>                  
                                <button onClick={() => setSaveVisible(true)} className={`w-[269px] h-[67px] border-2 border-black bg-[#0900FF] font-inter font-bold text-[32px] text-white rounded-[20px] ${saveVisible ? 'hidden' : ''} `}> {user.id == 1 ? 'Create news' : 'Create an article' } </button>
                                                       </div>
                                                       {saveVisible && 
                                                       <div className=' bg-transparent w-[1444px] h-[565px] z-50 absolute top-0 left-0'>
                                                        {user.id == 1 ?                                                         <CreateNews /> : <CreateArticles />  }
                                                       </div>
                                                       }
<div className='w-full h-full justify-start pl-[54px] flex items-end pb-[17px] '>
{ user.id == 1 ? (
  <div className='flex'>
<button  className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${isClicked[2] ? 'bg-[#111111] text-white' : 'bg-white text-black '}`} onClick={() => handleClick(2)}>News</button>
<div className='w-[7px] h-full'></div>

<button  className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${isClicked[3] ? 'bg-[#111111] text-white' : 'bg-white text-black '}`} onClick={() => handleClick(3)}>Users</button>
<div className='w-[7px] h-full'></div>
  </div>
) : '' }

<button  className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${isClicked[0] ? 'bg-[#111111] text-white' : 'bg-white text-black '}`} onClick={() => handleClick(0)}>Articles</button>
<div className='w-[7px] h-full'></div>
<button  className={`w-[178px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${isClicked[1] ? 'bg-[#111111] text-white' : 'bg-white text-black '}`} onClick={() => handleClick(1)}>Comments</button>

</div>
                            </div>
                            <h1 className="underline text-[41px] z-50 pl-[54px] "> {user.id == 1 ? 'All' : 'My'} {isClicked[0] ? 'Articles' : isClicked[1] ? 'Comments' : isClicked[2] ? 'News' : 'Users' } </h1>
<div className='h-[14px]  '></div>
<div>
  {user.id == 1 && isClicked[2] && (
    <ShowNews />
  )}
    {user.id == 1 && isClicked[0] && (
    <ShowArticles />
  )}  

  {
    isClicked[1] && (
      <ShowComments />
    )
  }

{isClicked[3] && (
  <ShowUsers />
)}


{user.id != 1 && isClicked[0] && (
    <ShowUserArticles />
  )}  


</div>

                    {/* ------------------------------------------------ */}
                </div>
            </body>
        </html>
    );
};