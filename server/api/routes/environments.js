import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Environments
router.get('/', async (req, res) => {
  const environments = await dataService.getEnvironments();
  res.json(environments);
});

router.post('/', async (req, res) => {
  const environment = await dataService.createEnvironment(req.body);
  res.status(201).json(environment);
});

router.put('/:id', async (req, res) => {
  const environment = await dataService.updateEnvironment(req.params.id, req.body);
  res.json(environment);
});

router.delete('/:id', async (req, res) => {
  await dataService.deleteEnvironment(req.params.id);
  res.status(204).send();
});

export default router;