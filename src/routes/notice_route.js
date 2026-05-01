import express from "express";
import { uploadFile } from "../middlewares/upload.js";
import authMiddleware from "../middlewares/auth_middleware.js";
import { addNotice } from "../controlllers/notice_controller.js";
import { fetchNotices } from "../controlllers/notice_controller.js";
import { deleteNotice } from "../controlllers/notice_controller.js";

const router = express.Router();

router.post("/addNotice",authMiddleware,uploadFile.single("file"),addNotice);
router.get("/fetchNotice",authMiddleware,fetchNotices);
router.delete("/deleteNotice/:id",authMiddleware,deleteNotice);
export default router;