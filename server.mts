import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

console.log("🟢 Starting server setup..."); // Add this

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let count = 0;
app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // ✅ or restrict to your actual frontend domain later
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔗 User Connected with id: ${socket.id}`);

    socket.on("join_room", ({ room, username }) => {
      console.log(`User ${username} joining ${room}`);
      socket.join(room);
      socket.to(room).emit("user_joined");
    });
    socket.on("increment", () => {
      count = count + 1;
      console.log("count ", count);
      io.emit("updated_count", count);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  httpServer.listen(port, () => {
    console.log(`🚀 Server running on: http://${hostname}:${port}`);
  });
});
