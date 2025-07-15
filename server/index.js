import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { db } from "./Models/db.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js"
import { requireRole } from "./middleware/requriedRole.js";
import { socketHandler } from "./Controller/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

socketHandler(io)

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))
app.get("api/agent-only", requireRole("agent"), (req, res)=>{
    res.send('This is agent-only content')
})
app.use("/api/auth", authRoutes)

await db();

server.listen(process.env.PORT, () => {
  console.log("✅ Server Running on port", process.env.PORT);
});
