import express from 'express';
import authMiddleware from "../middlewares/auth_middleware.js";
import {addQuiz} from "../controlllers/quiz_controller.js";
import { fetchQuiz } from '../controlllers/quiz_controller.js';
import { deleteQuiz } from '../controlllers/quiz_controller.js';
import { updateQuiz } from '../controlllers/quiz_controller.js';

const router = express.Router();

router.post("/addQuiz",authMiddleware,addQuiz);
router.get("/fetchQuiz",authMiddleware,fetchQuiz);
router.delete("/deleteQuiz/:id",authMiddleware,deleteQuiz);
router.put("/updateQuiz/:id",authMiddleware,updateQuiz);

export default router;

