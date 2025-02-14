import { UserContext } from "./assets/UserContext";
import { useContext } from "react";

export default function CreateArticles () {
    const { user,saveVisible, setSaveVisible } = useContext(UserContext);

    const postPost = async (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
    
      const dataEntries = Object.fromEntries(data.entries());
      const dataJson = JSON.stringify({
        ...dataEntries,
      });
    
      try {
        const response = await fetch("http://localhost:3000/posts/newArticles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Tell the server to expect JSON
          },
          body: dataJson, // Send JSON string
        });
    
        const result = await response.json();
        if (response.ok) {
          console.log("Post successfully created!");
          setSaveVisible(false);
        } else {
          console.log("Error posting post:", result);
        }
      } catch (error) {
        console.error("Error:", error);
      }

      window.location.reload();
    };
     

    return (
        <html>
            <body className="font-inter bg-white w-screen h-screen flex items-center justify-center text-[#111111] overflow-hidden bg-transparent">
                <div>
                    {/* ------------------------ */}
                    <div className="w-[1444px] h-[565px] bg-opacity-40 rounded-[11px]  flex flex-col pl-[32px] pb-[37px] overflow-hidden">
                        <div className="h-[14px] "></div>
                        <h1 className="text-[#0900FF] font-roboto text-[41px] font-semibold underline">Create an article/ </h1>
                        <div className="h-[32px] "></div>
                        {/*  */}
                    <form onSubmit={postPost} className='flex flex-col  pl-[15px] items-start justify-evenly  h-full  font-inter text-[24px] font-normal'>
                      <div className="flex w-full h-full">
                      <div className="flex flex-col w-full  h-[316px]">
                      <div className="flex justify-start w-full">
                        <div>
                        <label className="font-inter text-[24px] font-normal ">Title:</label>
                      <input type='text' name='title' className='text-black pl-2 border-2 w-[750px] h-[57px] rounded-[20px] border-[#0900FF] bg-[#00C0CC] bg-opacity-0 '  />
                        </div>
                        <div className="w-[28px] "></div>
                        <div>
                        <label className="font-inter text-[24px] font-normal ">Image link:</label>
                      <input type='text' name='imgUrl' className='text-black pl-2 border-2 w-[550px] h-[57px] rounded-[20px] border-[#0900FF] bg-[#00C0CC] bg-opacity-0 '  />
                      <input type="hidden" name="userId" value={user.id} />
                        </div>
                      </div>
                      <div className="h-[25px] "></div>
                      <div className="flex flex-col justify-center ">
                      <label className="font-inter text-[24px] font-normal ">Description:</label>
                      <div className="h-[10px] w-full "></div>
                      <input type='text' name='postDescription' className='text-black pl-2 border-2 w-[1330px] h-[132px] rounded-[20px] border-[#0900FF] bg-[#00C0CC] bg-opacity-0 '  />
                      <div className="h-[10px] w-full "></div>
                      </div>
                      <div className="flex flex-col justify-center">
                      </div>
                      </div>
                      </div>
                    <div className="flex justify-center items-center  w-full h-[60px] rounded-[20px] ">                    <button type='submit' className=' bg-[#0900FF]  text-white w-[131px]  h-[57px]  border-2 border-black rounded-[20px] text-[24px] font-inter font-normal '>Publish</button>
                    <div className="w-[51px] h-3 "></div>
                    <button type='submit' className='bg-transparent text-[#111111] w-[131px]  h-[57px]  border-2 border-black rounded-[20px] text-[24px] font-inter font-normal' onClick={() => setSaveVisible(false)}>Cancel</button>
                    </div>
                  </form>
                    </div>
                    {/* -------------------------- */}
                </div>
            </body>
        </html>
    );
};