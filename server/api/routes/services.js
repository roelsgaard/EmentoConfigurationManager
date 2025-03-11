import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Services
router.get('/', async (req, res) => {
  const services = await dataService.getServices();
  res.json(services);
});

router.post('/', async (req, res) => {
  const service = await dataService.createService(req.body);
  res.status(201).json(service);
});

router.put('/:id', async (req, res) => {
  const service = await dataService.updateService(req.params.id, req.body);
  res.json(service);
});

router.delete('/:id', async (req, res) => {
  await dataService.deleteService(req.params.id);
  res.status(204).send();
});

export default router;