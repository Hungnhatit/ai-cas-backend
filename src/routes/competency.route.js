import express from 'express';
import { getAllCriterias } from '../controllers/competency/competency.controller.js';

const router = express.Router();

router.get('/criterias', getAllCriterias);

export default router;
