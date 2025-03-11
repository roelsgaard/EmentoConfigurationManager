import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Hidden Variables
router.get('/', async (req, res) => {
  const hiddenVariables = await dataService.getHiddenVariables();
  res.json(hiddenVariables);
});

router.post('/', async (req, res) => {
  const { variableId, level, entityId, hidden } = req.body;
  await dataService.setVariableHidden(variableId, level, entityId, hidden);
  res.status(200).json({ success: true });
});

export default router;