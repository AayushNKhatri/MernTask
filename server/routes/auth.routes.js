import express from "express"
import { login, logout } from "../Controller/user.controller.js";

const routes = express.Router();


routes.post("/login", login)
routes.post("/logout", logout)

export default routes