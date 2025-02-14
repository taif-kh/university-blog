import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./assets/UserContext";

export default function ShowComments () {
    const {user} = useContext(UserContext);
    const [comments, setComments] = useState([]);

useEffect(() => {
    axios.get('http://localhost:3000/allComments')
    .then(response => {
        setComments(response.data);
        console.log("Fetched comments:", response.data); 
    })
    .catch(err => {
        console.error('There was an error fetching the messages!', err);
        // setLoading(false);
    });

},[]);

let userComments = comments.filter(comment => Number(comment.userId) === Number(user.id));

const removeComment = (e, comId) => {
    e.preventDefault();

    axios.delete(`http://localhost:3000/com/${comId}`)
    .then(response => {
        console.log("DELETED:", response.data); 
        setComments(prevComments => prevComments.filter(comment => comment.id !== comId));
    })
    .catch(err => {
        console.error('There was an error deleting the comment!', err);
    });
};


    return (
        <html>
            <body>
                <div>
                    {/* ---------------------------------------------------------------- */}
                    <div className="flex flex-col">
                    { user.id == 1 ? (
                        <div className="flex pl-[74px] ">
                            <h1 className="font-inter font-medium text-[21px] underline ">From:</h1>
                            <div className="w-[266px]  h-3 "></div>
                            <h1 className="font-inter font-medium text-[21px] underline ">Description:</h1>
                            <div className="w-[517px]  h-3 "></div>
                            <h1 className="font-inter font-medium text-[21px] underline ">Date:</h1>
                        </div> 
                        ) : (
                            <div className="flex pl-[74px] ">
                            <h1 className="font-inter font-medium text-[21px] underline ">From:</h1>
                            <div className="w-[266px]  h-3 "></div>
                            <h1 className="font-inter font-medium text-[21px] underline ">Description:</h1>
                            <div className="w-[517px]  h-3 "></div>
                            <h1 className="font-inter font-medium text-[21px] underline ">Date:</h1>
                        </div>
                        )};

                        { user.id == 1 ? (
                            comments.map(comment => (
                                <div key={comment.id} className="ml-[30px] flex pl-[38px] w-[1425px] h-[83px] border-b-2 border-black items-center ">
                                    <h1 className="text-[36px] font-semibold font-inter min-w-[322px]  "> {comment.user.username} </h1>
                                    <h1 className="text-[36px] font-semibold font-inter min-w-[635px] "> {comment.description} </h1>
                                    <h1 className="text-[21px] font-semibold font-inter "> {comment.addedAt} </h1>
                                    <button className="text-[21px] w-[200px] font-semibold font-inter   underline flex justify-end pr-[34px]" onClick={(e) => removeComment(e, comment.id)}> Remove </button>
                                </div>
                            ))
                        ) : (
                            userComments.map(comment => (
                                <div key={comment.id} className="ml-[30px] flex pl-[38px] w-[1425px] h-[83px] border-b-2 border-black items-center ">
                                    <h1 className="text-[36px] font-semibold font-inter min-w-[322px]  "> {comment.user.username} </h1>
                                    <h1 className="text-[36px] font-semibold font-inter min-w-[635px] "> {comment.description} </h1>
                                    <h1 className="text-[21px] font-semibold font-inter "> {comment.addedAt} </h1>
                                    <button className="text-[21px] w-[200px] font-semibold font-inter   underline flex justify-end pr-[34px]" onClick={(e) => removeComment(e, comment.id)}> Remove </button>
                                </div>
                            ))
                        )

                        }
                    </div>
                    {/* ---------------------------------------------------------------- */}
                </div>
            </body>
        </html>
    );
};