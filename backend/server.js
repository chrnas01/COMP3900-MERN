const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const path = require('path')

const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()
const app = express();

app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json({limit: '1mb'}))

// routes
app.use('/appointment', require('./routes/appointmentRoutes'))
app.use('/auth', require('./routes/userRoutes'))
app.use('/chat', require('./routes/chatRoutes'));
app.use('/courses', require('./routes/courseRoutes'))
app.use('/message', require('./routes/messageRoutes'));
app.use('/review', require('./routes/reviewRoutes'));

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler)

PORT = process.env.PORT || 5000
SOCKET_URL = `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`

const server = app.listen(
    PORT,
    console.log(`App listening on port ${PORT}`),
    console.log(`App open to sockets from ${SOCKET_URL}`)
)

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: SOCKET_URL,
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (room) => { 
      if (!room.users) return console.log("chat.users not defined");
      socket.in(room._id).emit("message recieved", room)
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });