import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../src/App.css";
import { useContext } from "react";
import { UserContext } from "./assets/UserContext";
import ShowNews from "./ShowNews";
import ShowArticles from "./ShowArticles";

export default function ShowMore() {
  const { position, setPosition } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isClicked, setIsClicked] = useState({});

  function handleClick(id) {
    setIsClicked({ [id]: true });
    localStorage.setItem("savedButton", id);
  }

  const navigate = useNavigate();

  // --------------------------------------------------------

  useEffect(() => {
    let savedButton = localStorage.getItem("savedButton");
    if (savedButton) {
      setIsClicked({ [savedButton]: true });
    } else {
      handleClick(2);
    }

    const fetchData = async () => {
      try {
        const postsResponse = await axios.get("http://localhost:3000/");
        setPosts(postsResponse.data);

        const commentsResponse = await axios.get(
          "http://localhost:3000/comments"
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    fetchData();
  }, []);

  const postsWithComments = posts.map((post) => {
    return {
      ...post,
      comments: comments
        .filter((comment) => comment.postId === post.id)
        .map((comment) => ({
          ...comment,
          userImgUrl: comment.user?.imgUrl,
          username: comment.user?.username,
        })),
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
      behavior: "smooth",
    });
  };

  return (
    <html>
      <body className="bg-white text-[#111111] w-full h-full font-inter font-semibold ">
        <div className="w-screen h-screen ">
          {/* ------------------------------------------------ */}
          <div className="h-[29px]  "> </div>
          <div className="w-full h-[46px] pl-[31px] pr-[44px] flex justify-between items-center">
            <h1 className="underline text-[56px] z-50"> Latest Updates </h1>
            <h1 className="underline text-[56px] z-50">
              <Link to="/">Home - </Link>{" "}
            </h1>
          </div>
          <div className="h-[20px]"></div>
          <div className="h-[93px] flex w-full  items-center justify-start pl-[31px] ">
            <button
              className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${
                isClicked[2]
                  ? "bg-[#111111] text-white"
                  : "bg-white text-black "
              }`}
              onClick={() => handleClick(2)}
            >
              All
            </button>
            <div className="w-[7px] h-full"></div>
            <button
              className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${
                isClicked[0]
                  ? "bg-[#111111] text-white"
                  : "bg-white text-black "
              }`}
              onClick={() => handleClick(0)}
            >
              News
            </button>
            <div className="w-[7px] h-full"></div>
            <button
              className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${
                isClicked[1]
                  ? "bg-[#111111] text-white"
                  : " bg-white text-black"
              }`}
              onClick={() => handleClick(1)}
            >
              Articles
            </button>
          </div>
          {isClicked[0] ? (
            <ShowNews />
          ) : isClicked[1] ? (
            <ShowArticles />
          ) : (
            <div className="h-[554px]  ml-[31px] mr-[44px] flex flex-col relative  font-inter">
              {postsWithComments.map((post) => (
                <div key={post.id}>
                  <div className="w-full h-[243px] bg-[#0900FF] border-black pl-[76px] pr-[28px] pb-[27px] pt-[16px] flex">
                    <div className="bg-gray-400 max-w-[328px] h-[201px]">
                      <img
                        src={post.imgUrl}
                        className="w-[449px] h-[201px] object-cover"
                      />
                    </div>
                    <div className="w-[52px] h-full "></div>
                    <div className="w-full h-full  flex flex-col">
                      <div className="h-[50px] w-full  flex justify-between items-center pr-1 text-white">
                        <h1 className="text-[36px] ">{post.title} </h1>
                        <div className="flex gap-x-1">
                          <div className="bg-white h-[27px] w-[27px] rounded-full ">
                            <img
                              src={post.user.imgUrl}
                              className="h-[27px] w-[27px] rounded-full"
                            />
                          </div>
                          <h1>{post.user.username} </h1>
                        </div>
                      </div>
                      <div className="h-3  w-full "></div>
                      <div className="h-[92px] w-full ">
                        <h1 className="text-white text-[24px] font-normal ">
                          {" "}
                          {post.postDescription.slice(0, 150) + "...."}{" "}
                        </h1>
                      </div>
                      <div className=" w-full h-full flex justify-between items-end">
                        <h1 className="text-[16px] font-semibold text-white ">
                          {" "}
                          {post.addedAt}{" "}
                        </h1>

                        <Link to={`/${post.id}`}>
                          {" "}
                          <h1 className="text-[24px] font-normal text-white underline ">
                            Read more
                          </h1>{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="h-[9px] bg-white w-full "></div>
                </div>
              ))}
            </div>
          )}
          {/* ------------------------------------------------ */}
        </div>
      </body>
    </html>
  );
}
