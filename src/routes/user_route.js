import express from "express";
import { fetchNotes } from "../controlllers/user_controller.js";
import { fetchQuizs } from "../controlllers/user_controller.js";
import { fetchNotices } from "../controlllers/user_controller.js";
const router = express.Router();

router.get("/fetchNotes",fetchNotes);
router.get("/fetchQuizs",fetchQuizs);
router.get("/fetchNotices",fetchNotices)

export default router;