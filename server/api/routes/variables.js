import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Variables
router.get('/', async (req, res) => {
  const variables = await dataService.getVariables();
  res.json(variables);
});

router.post('/', async (req, res) => {
  const variable = await dataService.createVariable(req.body);
  res.status(201).json(variable);
});

router.put('/:id', async (req, res) => {
  const variable = await dataService.updateVariable(req.params.id, req.body);
  res.json(variable);
});

router.delete('/:id', async (req, res) => {
  await dataService.deleteVariable(req.params.id);
  res.status(204).send();
});

export default router;