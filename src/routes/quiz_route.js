import express from 'express';
import authMiddleware from "../middlewares/auth_middleware.js";
import {addQuiz} from "../controlllers/quiz_controller.js";

const router = express.Router();

router.post("/addQuiz",authMiddleware,addQuiz);

export default router;

