import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "./assets/UserContext";

export default function PostDetailsActual() {
  const [liked, setLiked] = useState(false);
  const [postDetails, setPostDetails] = useState({});
  const { user, position } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [addComment, setAddComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let { postId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/posts/${postId}`)
      .then((response) => {
        setPostDetails(response.data);
        console.log("Fetched comments:", response.data);
      })
      .catch((err) => {
        console.error("There was an error fetching the messages!", err);
        setError("Failed to fetch comments");
      });

    if (user?.id) {
      axios
        .get(`http://localhost:3000/likes/user/${user.id}/post/${postId}`)
        .then((response) => {
          if (response.data) {
            setLiked(true);
          }
        })
        .catch(console.error);
    }

    axios
      .get(`http://localhost:3000/comments/${postId}`)
      .then((response) => {
        setComments(response.data);
        console.log("Fetched comments:", response.data);
      })
      .catch((err) => {
        console.error("There was an error fetching the messages!", err);
        setError("Failed to fetch comments");
      });

    setLoading(false);
  }, [postId, user]);

  let inverseComments =
    comments.length > 0 ? [...comments].sort((a, b) => a.id - b.id) : [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const postComment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    axios
      .post("http://localhost:3000/comments/new", data)
      .then((response) => {
        console.log(response.data);
        setComments((prevComments) => [...prevComments, response.data]);
        console.log("Updated comments:", [...comments, response.data]);
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      });

    window.location.reload();
  };

  const postLike = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (liked === false) {
      axios
        .post(`http://localhost:3000/likes/${postId}`, data)
        .then((response) => {
          console.log(response.data);
          setLiked(true);
        })
        .catch((error) => {
          console.error("There was an error submitting the form!", error);
        });
    } else {
      axios
        .delete(`http://localhost:3000/likes/user/${user.id}/post/${postId}`)
        .then((response) => {
          console.log(response.data);
          setLiked(false);
        })
        .catch((error) => {
          console.error("There was an error submitting the form!", error);
        });
    }

    window.location.reload();
  };

  return (
    <html>
      <body>
        <div className="w-screen h-screen bg-white text-[#111111] flex flex-col pt-[21px] px-[46px] font-inter font-semibold overflow-x-hidden">
          {/* -------------------------------- */}
          <div className="w-full h-full">
            <div className="flex justify-between">
              <h1 className="text-[36px] ">{postDetails.title} </h1>
              <button
                onClick={() => {
                  if (user) {
                    window.location.href = "/dashboard";
                  } else {
                    window.location.href = "/";
                  }
                }}
              >
                <h1 className="text-[36px] underline">Home -</h1>
              </button>
            </div>
            <div className="h-[27px] w-full  "></div>
            <div className=" ">
              {" "}
              <img
                src={postDetails.imgUrl}
                className="h-[501px] w-full object-cover "
              />{" "}
            </div>
            <div className="h-[13px] w-full  "></div>
            <div className="flex justify-between items-center">
              <div className="flex justify-evenly pl-[12px] ">
                <div className=" h-[27px] w-[27px] rounded-full ">
                  <img
                    src={postDetails.user?.imgUrl}
                    className="h-[27px] w-[27px] rounded-full object-cover"
                  />
                </div>
                <div className="w-[12px] "></div>
                <h1 className="font-roboto font-normal text-[16px]">
                  {" "}
                  {postDetails.user?.username}{" "}
                </h1>
                <div className="w-[20px] "></div>
                <h1 className="font-roboto font-semibold text-[16px]">
                  {postDetails.addedAt}{" "}
                </h1>
              </div>
              <div className="w-[131px] h-[57px] flex items-center justify-center bg-[#111111] text-white  ">
                {" "}
                <h1 className="font-inter text-[24px] font-normal ">
                  {postDetails.isPublished ? "News" : "Articles"}{" "}
                </h1>{" "}
              </div>
            </div>
            <div className="h-[39px] "></div>
            <div className="max-h-[160px] w-full">
              <h1 className="font-inter text-[24px] font-normal ">
                {postDetails.postDescription}{" "}
              </h1>
            </div>
            <div className="h-[17px]  "></div>

            <div className="bg-white">
              <div className="flex bg-white">
                <div className="w-[451px]"></div>

                {user ? (
                  <form className="bg-white" onSubmit={postLike}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="w-[161px] h-[61px] border-2 bg-[#E74E5F] border-black rounded-[11px] text-[37px] flex justify-center font-medium font-inter"
                    >
                      {" "}
                      {liked ? "Unlike" : "Like"}{" "}
                    </button>
                  </form>
                ) : (
                  <p></p>
                )}

                <div className="w-[143px]"></div>

                {user ? (
                  <div className="w-[311px] h-[61px] border-2 bg-[#FF8C25] border-black rounded-[11px] text-[37px] flex justify-center font-medium font-inter">
                    <button onClick={() => setAddComment(!addComment)}>
                      Comment
                    </button>
                  </div>
                ) : (
                  <p></p>
                )}
              </div>

              <div className="h-[16px]"></div>

              {addComment && user ? (
                <form className="flex " onSubmit={postComment}>
                  <div className="w-[447px]"></div>
                  <div className="w-[619px] h-[157px] border-2 border-black rounded-[11px] py-[23px] px-[15px]">
                    <input type="hidden" name="postId" value={postDetails.id} />
                    <input type="hidden" name="userId" value={user.id} />
                    <textarea
                      className="text-[28px] w-full h-full bg-transparent resize-none"
                      placeholder="Type your comment.. "
                      name="description"
                    />
                  </div>
                  <div className="w-[32px]"></div>
                  <div className="self-end">
                    <button
                      className="text-[37px] font-bold font-inter underline leading-[30px]"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              ) : (
                <p></p>
              )}

              <div className="text-[68px] flex ">
                <div className="w-[16px]"></div>
                <div className="flex"> Comments</div>
              </div>
              <div className="h-[23px]"> </div>
              <div className="font-inter w-[1519px]  mr-10">
                {comments.map((comment, index) => (
                  <div key={index}>
                    <div
                      className={`h-[61px] w-[1424px] border-2 border-black flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-y-110 hover:scale-x-105 hover:bg-blue-400 duration-300`}
                    >
                      <div className="w-[39px]"></div>
                      <h1 className="text-[37px]">
                        {" "}
                        {comment.user?.username}_{" "}
                      </h1>
                      <div className="w-[200px]"></div>
                      <h1 className="text-[37px]"> {comment.description} </h1>
                    </div>
                    <div className="h-[10px]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* -------------------------------- */}
        </div>
      </body>
    </html>
  );
}
