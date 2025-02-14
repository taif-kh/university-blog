import { UserContext } from "./assets/UserContext";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

import axios from "axios";

export default function EditPost() {
    const { user, saveVisible, setSaveVisible } = useContext(UserContext);
    const [postDetails, setPostDetails] = useState({});
    const { postId } = useParams(); 

    useEffect(() => {
        axios.get(`http://localhost:3000/posts/edit/${postId}`)
            .then((response) => {
                console.log(response.data);
                setPostDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching post details:', error);
            });
    }, [postId]);

    const editPost = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        const dataEntries = Object.fromEntries(data.entries());
        const dataJson = JSON.stringify({
            ...dataEntries,
        });

        try {
            const response = await fetch(`http://localhost:3000/posts/edit/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: dataJson,
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Post successfully updated!");
                setSaveVisible(false);

            } else {
                console.log("Error updating post:", result);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        window.location.href = "/dashboard";
    };

    return (
        <html>
            <body className="font-inter bg-white w-screen h-screen flex items-center justify-center text-[#111111] overflow-hidden bg-transparent">
                <div>
                    <div className="w-[1444px] h-[565px] bg-opacity-40 rounded-[11px] flex flex-col pl-[32px] pb-[37px] overflow-hidden">
                        <h1 className="text-[#0900FF] font-roboto text-[41px] font-semibold underline">Edit {postDetails.isPublished? 'the News' : 'the Article'}/</h1>
                        <form onSubmit={editPost} className='flex flex-col pl-[15px] items-start justify-evenly h-full font-inter text-[24px] font-normal'>
                            <div className="flex flex-col w-full h-[316px]">
                                <label className="font-inter text-[24px] font-normal">Title:</label>
                                <input type='text' name='title' defaultValue={postDetails.title} className='text-black border-2 w-[750px] h-[57px] rounded-[20px] border-[#0900FF] bg-[#00C0CC] bg-opacity-0' />
                                <label className="font-inter text-[24px] font-normal">Image link:</label>
                                <input type='text' name='imgUrl' defaultValue={postDetails.imgUrl} className='text-black border-2 w-[550px] h-[57px] rounded-[20px] border-[#0900FF] bg-[#00C0CC] bg-opacity-0' />
                                <label className="font-inter text-[24px] font-normal">Description:</label>
                                <input type='text' name='postDescription' defaultValue={postDetails.postDescription} className='text-black border-2 w-[1330px] h-[132px] rounded-[20px] border-[#0900FF] bg-[#00C0CC] bg-opacity-0' />
                            </div>
                            <div className="flex justify-center items-center w-full h-[60px] rounded-[20px]">
                                <button type='submit' className='bg-[#0900FF] text-white w-[131px] h-[57px] border-2 border-black rounded-[20px] text-[24px] font-inter font-normal flex items-center justify-center'>Save</button>
                                <div className="w-[20px] "></div>
                                <button  className='bg-transparent text-[#111111] w-[131px] h-[57px] border-2 border-black rounded-[20px] text-[24px] font-inter font-normal' onClick={()=> window.location.href="/dashboard"}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </body>
        </html>
    );
}
