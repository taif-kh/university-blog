import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [saveVisible, setSaveVisible] = useState(false);

  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem("position");
    return savedPosition ? Number(savedPosition) : 50;
  });

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("jwt_token");
    const id = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (token && id && email && username) {
      return { token, id, email, username };
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("position", position);
  }, [position]);

  return (
    <UserContext.Provider value={{ user, setUser, position, setPosition, saveVisible, setSaveVisible }}>
      {children}
    </UserContext.Provider>
  );
};
