// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { AuthContext } from "./AuthContext";

// export const SocketContext = createContext();

// export const SocketContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     setSocket(io("http://localhost:4000"));
//   }, []);

//   useEffect(() => {
//   currentUser && socket?.emit("newUser", currentUser.id);
//   }, [currentUser, socket]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

const SOCKET_SERVER_URL =  "http://localhost:4000";

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isServerAvailable, setIsServerAvailable] = useState(true);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000, // 5 seconds timeout
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setSocket(newSocket);
      setIsServerAvailable(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsServerAvailable(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      socket.emit("newUser", currentUser.id);
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket, isServerAvailable }}>
      {children}
    </SocketContext.Provider>
  );
};