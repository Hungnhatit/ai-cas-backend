import express from "express";
import { evaluate, evaluatePrompt, evaluateSituation, getAIResult } from "../controllers/result/aiEvaluation.controller.js";

const router = express.Router();

router.get('/:result_id/result', getAIResult);
router.post("/evaluate", evaluate);
router.post('/evaluate/prompt', evaluatePrompt);
router.post('/evaluate/situation', evaluateSituation)


export default router;
