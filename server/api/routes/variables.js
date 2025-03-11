import express from 'express';
const router = express.Router();
import Variable from './../../model/variable.js';

// Variables
router.get('/', async (req, res) => {
  const variables = await Variable.getVariables();
  res.json(variables);
});

router.post('/', async (req, res) => {
  const variable = await Variable.createVariable(req.body);
  res.status(201).json(variable);
});

router.put('/:id', async (req, res) => {
  const variable = await Variable.updateVariable(req.params.id, req.body);
  res.json(variable);
});

router.delete('/:id', async (req, res) => {
  await Variable.deleteVariable(req.params.id);
  res.status(204).send();
});

export default router;