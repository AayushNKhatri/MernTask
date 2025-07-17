import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { db } from "./Models/db.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js"
import { requireRole } from "./middleware/Role.js";
import { socketHandler } from "./Controller/socket.js";
import { seedAdmin } from "./Models/seed.js";
import  adminRoutes  from "./routes/admin.routes.js"
import messege from "./routes/message.routes.js"

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials:true,
    methods: ["GET", "POST"]
  },
});

socketHandler(io)

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials:true
  }
));
app.use(express.json());
app.use(morgan("combined"));
app.use(session({
    name: "session",
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))
seedAdmin();
app.get("api/agent-only", requireRole("agent"), (req, res)=>{
    res.send('This is agent-only content')
})
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/message", messege)

await db();

server.listen(process.env.PORT, () => {
  console.log("✅ Server Running on port", process.env.PORT);
});
