import express from "express";
import { fetchNotes } from "../controlllers/user_controller.js";

const router = express.Router();

router.get("/fetchNotes",fetchNotes);

export default router;