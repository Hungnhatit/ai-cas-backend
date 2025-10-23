import express from "express";
import { evaluate } from "../controllers/result/aiEvaluation.controller.js";

const router = express.Router();

router.post("/evaluate", evaluate);

export default router;
