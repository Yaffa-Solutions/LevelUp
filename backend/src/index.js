const app = require("./app");
const port = app.get("port");

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  socket.on("UserJoin", (username, chat_id) => {
    socket.join(chat_id);
    io.to(chat_id).emit("UserJoined", {
      username,
    });
  });

  socket.on("sendMessage", ({ messageId, chat_id, content, sender_id,created_at }) => {
    io.to(chat_id).emit("receiveMessage", {
      messageId,
      chat_id,
      content,
      sender_id,
      created_at
    });
  });

  socket.on("removeMessage", ({ messageId, chat_id }) => {
    io.to(chat_id).emit("removedMessage", { messageId });
  });

  socket.on("deleteChat", ({ chat_id }) => {
    io.to(chat_id).emit("chatDeleted", { chat_id });
  });

  socket.on("typing", (username, chat_id) => {
    socket.to(chat_id).emit("userTyping", {
      username,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`App is live on http://localhost:${port}`);
});
