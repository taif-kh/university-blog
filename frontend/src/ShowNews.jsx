import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "./assets/UserContext";

export default function ShowNews() {
  const [news, setNews] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios
      .get("http://localhost:3000/news")
      .then((response) => {
        setNews(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching news!", error);
      });
  }, []);

  const removeItem = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    axios
      .delete(`http://localhost:3000/removeItem/${postId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    news.filter((article) => Number(article.id) !== Number(postId));
    window.location.reload();
  };
  function handleEditButton(e, postId) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/edit/${postId}`;
  }

  return (
    <html>
      <body className="w-full h-full bg-white">
        <div>
          {/* ------------------------------------------------ */}
          <div className="h-[554px]  ml-[31px] mr-[44px] flex flex-col relative  font-inter">
            {news.map((post) => (
              <div key={post.id}>
                {user ? (
                  <div
                    onClick={() => (window.location.href = `/${post.id}`)}
                    className="w-full h-[243px] bg-[#0900FF] border-black pl-[76px] pr-[28px] pb-[27px] pt-[16px] flex hover:cursor-pointer hover:bg-gray-500  "
                  >
                    {" "}
                    <div className="bg-gray-400 max-w-[328px] h-[201px]">
                      <img
                        src={post.imgUrl}
                        className="w-[449px] h-[201px] object-cover"
                      />
                    </div>
                    <div className="w-[52px] h-full "></div>
                    <div className="w-full h-full flex flex-col">
                      <div className="h-[50px] w-full flex justify-between items-center pr-1 text-white">
                        <h1 className="text-[36px] ">{post.title} </h1>
                        <div className="flex gap-x-1">
                          <div
                            className={`bg-white h-[27px] w-[27px] rounded-full ${
                              post.user.imgUrl ? "" : "hidden"
                            }`}
                          >
                            <img
                              src={post.user.imgUrl}
                              className="h-[27px] w-[27px] rounded-full"
                              alt="user's image"
                            />
                          </div>
                          <h1>{post.user.username} </h1>
                        </div>
                      </div>
                      <div className="h-3 w-full "></div>
                      <div className="h-[92px] w-full ">
                        <h1 className="text-white text-[24px] font-normal ">
                          {" "}
                          {post.postDescription.slice(0, 150) + "..."}{" "}
                        </h1>
                      </div>
                      <div className=" w-full h-full flex justify-between items-end">
                        <h1 className="text-[16px] font-semibold text-white ">
                          {" "}
                          {post.addedAt}{" "}
                        </h1>

                        <div className=" w-[174px] flex justify-end">
                          <button onClick={(e) => handleEditButton(e, post.id)}>
                            {" "}
                            <h1
                              className="text-[24px] font-normal text-white underline "
                              onClick={(e) => e.stopPropagation}
                            >
                              Edit
                            </h1>{" "}
                          </button>
                          <div className="w-[39px] h-3  "></div>
                          <button onClick={(e) => removeItem(e, post.id)}>
                            {" "}
                            <h1 className="text-[24px] font-normal text-white underline ">
                              Remove
                            </h1>{" "}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => (window.location.href = `/${post.id}`)}
                    className="w-full h-[243px] bg-[#0900FF] border-black pl-[76px] pr-[28px] pb-[27px] pt-[16px] flex hover:cursor-pointer hover:bg-gray-500  "
                  >
                    {" "}
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
                          <div
                            className={`bg-white h-[27px] w-[27px] rounded-full ${
                              post.user.imgUrl ? "" : "hidden"
                            }`}
                          >
                            <img
                              src={post.user.imgUrl}
                              className="h-[27px] w-[27px] rounded-full"
                              alt="user's image"
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

                        <div className=" w-[174px] flex justify-end">
                          <div className="w-[39px] h-3 "></div>
                          <Link to={`/${post.id}`}>
                            {" "}
                            <h1 className="text-[24px] font-normal text-white underline ">
                              Read more
                            </h1>{" "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="h-[9px] w-full bg-white "></div>
              </div>
            ))}
          </div>
          {/* ------------------------------------------------ */}
        </div>
      </body>
    </html>
  );
}
