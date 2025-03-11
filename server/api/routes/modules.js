import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Modules
router.get('/', async (req, res) => {
  const modules = await dataService.getModules();
  res.json(modules);
});

router.post('/', async (req, res) => {
  const module = await dataService.createModule(req.body);
  res.status(201).json(module);
});

router.put('/:id', async (req, res) => {
  const module = await dataService.updateModule(req.params.id, req.body);
  res.json(module);
});

router.delete('/:id', async (req, res) => {
  await dataService.deleteModule(req.params.id);
  res.status(204).send();
});

export default router;