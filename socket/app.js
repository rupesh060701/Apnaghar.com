// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExits = onlineUser.find((user) => user.userId === userId);
//   if (!userExits) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });

//   socket.on("checkConnection", () => {
//     // Send a confirmation back to the client to confirm the connection is working
//     socket.emit("connectionStatus", "Socket server is running and connection is successful");
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`); // Log when a user disconnects
//     removeUser(socket.id);
//   });
  
// });

// io.listen("4000", () => {
//   console.log("Socket.io server is running on http://localhost:4000");
// });







import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

// Add a route to check server status
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Socket.IO Server</title></head>
      <body>
        <h1>Socket.IO Server is Running</h1>
        <p>Server Status: Active ✅</p>
        <p>Listening on port 4000</p>
        <p>Connected Users: ${onlineUsers.length}</p>
      </body>
    </html>
  `);
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(`User added: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`Message sent to user: ${receiverId}`);
    } else {
      console.log(`Receiver ${receiverId} not found`);
      // Optionally, you could emit an error back to the sender
      socket.emit("messageError", "Receiver not online");
    }
  });

  socket.on("checkConnection", () => {
    socket.emit("connectionStatus", "Socket server is running and connection is successful");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    console.log(`Remaining online users: ${onlineUsers.length}`);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on Port:${PORT}`);
});

