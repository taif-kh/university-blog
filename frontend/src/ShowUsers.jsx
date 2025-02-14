import axios from "axios";
import { useEffect, useState } from "react";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/allUsers")
      .then((response) => {
        setUsers(response.data);
        console.log("Fetched comments:", response.data);
      })
      .catch((err) => {
        console.error("There was an error fetching the messages!", err);
      });
  }, []);

  const removeUser = (e, userId) => {
    e.preventDefault();
    e.stopPropagation();

    axios
      .delete(`http://localhost:3000/remove/${userId}`)
      .then((response) => {
        console.log("DELETED:", response.data);
        setUsers((prevComments) =>
          prevComments.filter(
            (comment) => Number(comment.id) !== Number(userId)
          )
        );
      })
      .catch((err) => {
        console.error("There was an error deleting!", err);
      });
  };

  return (
    <html>
      <body>
        <div>
          {/* ---------------------------------------------------------------- */}
          <div>
            <div className="flex pl-[74px] ">
              <h1 className="font-inter font-medium text-[21px] underline ">
                Name:
              </h1>
              <div className="w-[266px]  h-3 "></div>
            </div>
            {users
              .filter((user) => user.id !== 1)
              .map((user) => (
                <div
                  key={user.id}
                  className="ml-[30px] flex pl-[38px] w-[1425px] h-[83px]  items-center justify-between border-b-2 border-black"
                >
                  <h1 className="text-[36px] font-semibold font-inter min-w-[822px] ">
                    {" "}
                    {user.username}{" "}
                  </h1>
                  <button
                    onClick={(e) => removeUser(e, user.id)}
                    className="text-[21px] w-[200px] font-semibold font-inter underline flex justify-end pr-[34px]"
                  >
                    {" "}
                    Remove{" "}
                  </button>
                </div>
              ))}
          </div>
          {/* ---------------------------------------------------------------- */}
        </div>
      </body>
    </html>
  );
}
