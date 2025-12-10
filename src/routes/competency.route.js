import express from 'express';
import { getAllCriterias, getCompetencies, getCompetencyById } from '../controllers/competency/competency.controller.js';

const router = express.Router();

router.get('/criterias', getAllCriterias);
router.get('/', getCompetencies);
router.get('/:competency_id', getCompetencyById);

export default router;
