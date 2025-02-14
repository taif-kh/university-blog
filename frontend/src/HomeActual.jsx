import React, { useState, useEffect } from "react";
import axios from "axios";
// Axios is a popular library for making HTTP requests
import { Link, useNavigate } from "react-router-dom";
import "../src/App.css";
import { useContext } from "react";
import { UserContext } from "./assets/UserContext";
import { formatDistanceToNow } from "date-fns";
import Home2Actual from "./Home2Actual";
import ShowNews from "./ShowNews";
import ShowArticles from "./ShowArticles";

export default function HomeActual() {
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState({});
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);

  const { position, setPosition } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const [user, setUser] = useState(null); // Store both token and email

  function handleClick(id) {
    setIsClicked({ [id]: true });
    localStorage.setItem("savedButton", id);
  }

  const navigate = useNavigate();

  async function addToken(data) {
    try {
      let response = await fetch("http://localhost:3000/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
        mode: "cors",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred while logging in.");
        return;
      }
      if (error === null) {
        setLoginVisible(false);
      }

      const { token, id, email, username } = result;

      if (token && id && email && username) {
        setUser({ token, id, email, username });
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("tokenExpiration", expirationTime);
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        setError(null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function removeToken() {
    setUser(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("savedButton");
  }
  async function LoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const dataEntries = Object.fromEntries(data.entries());
    const dataJson = JSON.stringify(dataEntries);
    await addToken(dataJson);
  }
  // --------------------------------------------------------
  async function signupHandle(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    axios
      .post("http://localhost:3000/sign-up", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      });

    setSignupVisible(false);
  }
  // --------------------------------------------------------

  useEffect(() => {
    let savedButton = localStorage.getItem("savedButton");
    if (savedButton !== null) {
      setIsClicked({ [savedButton]: true });
    } else {
      handleClick(0);
    }

    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem("jwt_token");
      const storedId = localStorage.getItem("id");
      const storedEmail = localStorage.getItem("email");
      const storedUsername = localStorage.getItem("username");
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      const now = new Date().getTime();

      if (
        storedToken &&
        storedId &&
        storedEmail &&
        storedUsername &&
        tokenExpiration &&
        now <= tokenExpiration
      ) {
        setUser({
          token: storedToken,
          id: storedId,
          email: storedEmail,
          username: storedUsername,
        });
        console.log("User restored from localStorage:", {
          token: storedToken,
          id: storedId,
          email: storedEmail,
          username: storedUsername,
        });
      } else {
        // Token is expired or missing, clear localStorage and redirect to login
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        navigate("/"); // Adjust this to your login route
      }
    };

    const fetchData = async () => {
      try {
        const postsResponse = await axios.get("http://localhost:3000/");
        let collection = postsResponse.data;
        collection = collection.slice(0, 6);
        //   setPosts(postsResponse.data);
        setPosts(collection);

        const commentsResponse = await axios.get(
          "http://localhost:3000/comments"
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    checkTokenExpiration();
    fetchData();
  }, [history]);

  console.log("Rendering component with user:", user);

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
  async function postComment(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const dataEntries = Object.fromEntries(data.entries());
    const dataJson = JSON.stringify({
      ...dataEntries,
      userId: user.id, // Include user ID
    });

    try {
      const response = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Send JWT token for authentication
        },
        body: dataJson,
      });

      const result = await response.json();
      if (response.ok) {
        // Ensure `result` contains user details like `username` and `userImgUrl`.
        const newComment = {
          ...result, // Comment data from server
          userImgUrl: user.imgUrl, // Add user avatar
          username: user.username, // Add username
        };

        // Update the comments state to reflect the new comment
        setComments([...comments, newComment]);
      } else {
        console.log("Error posting comment:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // ---------
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <html>
      <body className="bg-white text-[#111111] w-full h-full font-roboto font-semibold">
        {!user ? (
          <div className="overflow-hidden">
            <div>
              {signupVisible && (
                <div className="absolute top-[200px] left-[500px] bg-white text-black w-[600px] h-[300px] flex flex-col justify-center items-center z-50 blur-0 border-2 border-black ">
                  <form onSubmit={signupHandle}>
                    <div className="flex flex-col items-center gap-y-2 justify-between w-[400px]">
                      <h1 className="text-[36px] leading-none self-center">
                        {" "}
                        Sign up{" "}
                      </h1>
                      <div className="h-3"></div>
                      <label className="flex justify-between w-full">
                        Username:
                        <input
                          type="text"
                          name="username"
                          className="w-52 border-black border-2"
                        />
                      </label>
                      <label className="flex justify-between  w-full">
                        Email:
                        <input
                          type="email"
                          name="userEmail"
                          className="w-52 border-black border-2"
                        />
                      </label>
                      <label className="flex justify-between  w-full">
                        Password:
                        <input
                          type="password"
                          name="password"
                          className="w-52 border-black border-2"
                        />
                      </label>
                      <label className="flex justify-between  w-full">
                        Image link:
                        <input
                          type="text"
                          name="imgUrl"
                          className="w-52 border-black border-2"
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-2 bg-blue-400 border-black border-2 w-[70px] h-[32px] "
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                  <div className="h-3"></div>
                  <button
                    onClick={() => window.location.reload()}
                    className="underline   w-full flex justify-end pr-3"
                  >
                    Home
                  </button>
                </div>
              )}
              {/* ------------------ */}
              {loginVisible && (
                <div className="absolute top-[200px] left-[600px] bg-white text-black border-2 border-black w-[400px] h-[300px] flex flex-col justify-evenly items-center z-50 blur-0">
                  <form onSubmit={LoginSubmit}>
                    <div className="flex flex-col items-center gap-y-2">
                      <h1 className="text-[36px] leading-none self-center">
                        {" "}
                        Log in{" "}
                      </h1>
                      <div className="h-3"></div>
                      <label className="w-[400px] flex justify-between px-5">
                        Email:
                        <input
                          type="email"
                          name="email"
                          className="w-52 border-black border-2"
                        />
                      </label>
                      <label className="w-[400px] flex justify-between px-5">
                        Password:
                        <input
                          type="password"
                          name="password"
                          className="w-52 border-black border-2"
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-2 w-[70px] h-[32px] bg-blue-400 border-black border-2"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                  <div className=" w-[400px] flex justify-between px-3">
                    <p className={`${error ? "text-red-600" : "hidden"}`}>
                      {" "}
                      {error}{" "}
                    </p>
                    <button
                      className="underline"
                      onClick={() => window.location.reload()}
                    >
                      Home
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`${signupVisible || loginVisible ? "blur-3xl" : ""}`}
            >
              {/* ------------------------------------------------ */}
              <div>
                {signupVisible && (
                  <div className="absolute top-[200px] left-[500px] bg-white text-black w-[600px] h-[300px] flex flex-col justify-center items-center z-50 blur-0 border-2 border-black ">
                    <form onSubmit={signupHandle}>
                      <div className="flex flex-col items-center gap-y-2 justify-between w-[400px]">
                        <h1 className="text-[36px] leading-none self-center">
                          {" "}
                          Sign up{" "}
                        </h1>
                        <div className="h-3"></div>
                        <label className="flex justify-between w-full">
                          Username:
                          <input
                            type="text"
                            name="username"
                            className="w-52 border-black border-2"
                          />
                        </label>
                        <label className="flex justify-between  w-full">
                          Email:
                          <input
                            type="email"
                            name="userEmail"
                            className="w-52 border-black border-2"
                          />
                        </label>
                        <label className="flex justify-between  w-full">
                          Password:
                          <input
                            type="password"
                            name="password"
                            className="w-52 border-black border-2"
                          />
                        </label>
                        <label className="flex justify-between  w-full">
                          Image link:
                          <input
                            type="text"
                            name="imgUrl"
                            className="w-52 border-black border-2"
                          />
                        </label>
                        <button
                          type="submit"
                          className="mt-2 bg-blue-400 border-black border-2 w-[70px] h-[32px] "
                        >
                          Sign up
                        </button>
                      </div>
                    </form>
                    <div className="h-3"></div>
                    <button
                      onClick={() => window.location.reload()}
                      className="underline   w-full flex justify-end pr-3"
                    >
                      Home
                    </button>
                  </div>
                )}
                {/* ------------------ */}
                {loginVisible && (
                  <div className="absolute top-[200px] left-[600px] bg-white text-black border-2 border-black w-[400px] h-[300px] flex flex-col justify-evenly items-center z-50 blur-0">
                    <form onSubmit={LoginSubmit}>
                      <div className="flex flex-col items-center gap-y-2">
                        <h1 className="text-[36px] leading-none self-center">
                          {" "}
                          Log in{" "}
                        </h1>
                        <div className="h-3"></div>
                        <label className="w-[400px] flex justify-between px-5">
                          Email:
                          <input
                            type="email"
                            name="email"
                            className="w-52 border-black border-2"
                          />
                        </label>
                        <label className="w-[400px] flex justify-between px-5">
                          Password:
                          <input
                            type="password"
                            name="password"
                            className="w-52 border-black border-2"
                          />
                        </label>
                        <button
                          type="submit"
                          className="mt-2 w-[70px] h-[32px] bg-blue-400 border-black border-2"
                        >
                          Log In
                        </button>
                      </div>
                    </form>
                    <div className=" w-[400px] flex justify-between px-3">
                      <p className={`${error ? "text-red-600" : "hidden"}`}>
                        {" "}
                        {error}{" "}
                      </p>
                      <button
                        className="underline"
                        onClick={() => window.location.reload()}
                      >
                        Home
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-[40px] "> </div>
              <div className="w-full h-[46px]  px-[31px] pr-[44px] flex justify-between items-center ">
                <h1 className="text-[40px] font-montserrat">UIK BLOG</h1>
                <div className="w-[699px]  h-3"></div>
                <div className="flex items-center gap-x-[8px] ">
                  <h1 className="text-[36px] ">
                    <button onClick={() => setSignupVisible(true)}>
                      Sign-up
                    </button>{" "}
                  </h1>
                  <img src="./arrow_black.png" className="" />
                  <h1 className="text-[36px] ">
                    <button onClick={() => setLoginVisible(true)}>
                      Log-in
                    </button>{" "}
                  </h1>
                  <img src="./arrow_black.png" className="" />
                </div>
              </div>
              <div className="w-full h-[90px] "></div>
              <div className="h-[66px] flex justify-center items-center">
                <h1 className="text-[56px] font-roboto">
                  Join the UIK University Life!
                </h1>
              </div>
              <div className="flex items-end h-[130px] justify-center">
                <button
                  className="w-[200px] h-[80px] rounded-[10px] bg-[#386DF1] text-[38px] font-roboto text-white"
                  onClick={() => setSignupVisible(true)}
                >
                  {" "}
                  Join us{" "}
                </button>
                <div className="w-[19px] "></div>
                <button
                  className="w-[200px] h-[80px] rounded-[10px] bg-[#1E1E1E] text-[38px] border-2 font-roboto text-white"
                  onClick={() => setLoginVisible(true)}
                >
                  {" "}
                  Log in{" "}
                </button>
              </div>
              <div className="h-[72px]"></div>
              <div className="h-[260px]  px-[31px] flex justify-center items-end z-0 relative">
                <div className="w-[584px] h-[264px] bg-transparent z-40 border-0 outline-none mr-4 flex justify-center items-center">
                  <img
                    src="./modifiedUIK.png"
                    className="w-[284px] h-[260px] object-cover border-0 outline-none "
                  />
                </div>
                <div className="pb-[40px]  w-full flex justify-between items-center absolute  px-[31px] pr-[44px] ">
                  <h1 className="underline text-[56px] z-50">
                    {" "}
                    <button
                      onClick={scrollToBottom}
                      className="cursor-pointer underline"
                    >
                      Latest updates
                    </button>{" "}
                  </h1>
                  <div className="w-[58px] h-[58px] rounded-full border-2 bg-[#1E1E1E] justify-center items-center ">
                    <button onClick={scrollToBottom}>
                      <img src="./arrow_down.png" />
                    </button>
                  </div>
                </div>
              </div>
              {/* ------------------------------------------------ */}
            </div>
            <Home2Actual />
          </div>
        ) : (
          <div className="w-screen h-screen ">
            {/* ------------------------------------------------ */}
            <div className="h-[49px]  "> </div>
            <div className="w-full h-[46px] pl-[31px] pr-[44px] flex justify-between items-center ">
              <h1 className="text-[40px]">Welcome, {user.username} </h1>
              <div className="w-[584px]  h-3"></div>
              <div className="flex items-center gap-x-[8px] ">
                <h1 className="text-[36px] text-[#0E57F3]">Home </h1>
                <img src="./arrow_blue.png" className="" />
                <h1 className="text-[36px] ">
                  <Link
                    onClick={() => {
                      setPosts([]);
                      window.location.href = "/dashboard";
                    }}
                    to="/dashboard"
                  >
                    {" "}
                    Dashboard
                  </Link>{" "}
                </h1>
                <img src="./arrow_black.png" className="" />
                <h1 className="text-[36px] ">
                  <button onClick={removeToken}>Log-out</button>
                </h1>
                <img src="./arrow_black.png" className="" />
              </div>
            </div>
            <div className="h-[138px]  w-full flex flex-col">
              <div className=" w-full h-[64px] flex"> </div>
              <div className="w-full h-full flex items-center justify-start pl-[54px]">
                <button
                  className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${
                    isClicked[0]
                      ? "bg-[#111111] text-white"
                      : "bg-white text-black "
                  }`}
                  onClick={() => {
                    handleClick(0);
                  }}
                >
                  News
                </button>
                <div className="w-[7px] "></div>
                <button
                  className={`w-[131px] font-inter font-normal text-[24px] h-[57px] border-2 border-black rounded-[20px] ${
                    isClicked[1]
                      ? "bg-[#111111] text-white"
                      : "bg-white text-black "
                  }`}
                  onClick={() => {
                    handleClick(1);
                  }}
                >
                  Articles
                </button>
              </div>
            </div>
            <h1 className="underline text-[41px] z-50 pl-[54px] ">
              {" "}
              Latest {isClicked[0] ? "News" : "Articles"}{" "}
            </h1>
            <div>{isClicked[0] ? <ShowNews /> : <ShowArticles />}</div>
            {/* ------------------------------------------------ */}
          </div>
        )}
      </body>
    </html>
  );
}
