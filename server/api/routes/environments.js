import express from 'express';
const router = express.Router();
import Environment from '../../model/environment.js';

// Environments
router.get('/', async (req, res) => {
  const environments = await Environment.getEnvironments();
  res.json(environments);
});

router.post('/', async (req, res) => {
  const environment = await Environment.createEnvironment(req.body);
  res.status(201).json(environment);
});

router.put('/:id', async (req, res) => {
  const environment = await Environment.updateEnvironment(req.params.id, req.body);
  res.json(environment);
});

router.delete('/:id', async (req, res) => {
  await Environment.deleteEnvironment(req.params.id);
  res.status(204).send();
});

export default router;