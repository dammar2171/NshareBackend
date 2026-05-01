import express from "express";
import { uploadPDF } from "../middlewares/upload.js";
import authMiddleware from "../middlewares/auth_middleware.js"
import { addNotes, deleteNotes, fetchNotes, updateNotes } from "../controlllers/notes_controller.js";

const router = express.Router();

router.post("/addNotes",authMiddleware,uploadPDF.single("pdfFile"),addNotes);
router.get("/fetchNotes",authMiddleware,fetchNotes);
router.delete("/deleteNotes/:id",authMiddleware,deleteNotes);
router.put("/updateNotes/:id",authMiddleware,uploadPDF.single("pdfFile"),
updateNotes
);

export default router;