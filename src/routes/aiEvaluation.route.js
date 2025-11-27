import express from "express";
import { evaluate, evaluatePrompt, evaluateSituation, getAIResult } from "../controllers/result/aiEvaluation.controller.js";
import { testAttemptResultEvaluate, testResultEvaluate } from "../controllers/test/test-competency-assessment.controller.js";

const router = express.Router();

router.get('/:result_id/result', getAIResult);
router.post("/evaluate", evaluate);
router.post('/evaluate/prompt', evaluatePrompt);
router.post('/evaluate/situation', evaluateSituation)

router.get('/attempt/:attempt_id/test-evaluate', testResultEvaluate);

router.post('/result/evaluate', testAttemptResultEvaluate);

export default router;
