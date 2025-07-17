import { assingAgent } from "../Controller/admin.controller.js";
import express from "express"
import { requireRole } from "../middleware/Role.js";

const routes = express.Router()

routes.post("/assing-agent", requireRole("admin"), assingAgent);

export default routes