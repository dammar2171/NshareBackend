import { loginAdmin } from "../controlllers/admin_controller.js";
import express from "express";

const router = express.Router();

router.post("/loginAdmin",loginAdmin);

export default router;