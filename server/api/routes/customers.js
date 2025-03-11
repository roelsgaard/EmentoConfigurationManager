import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Customers
router.get('/', async (req, res) => {
  const customers = await dataService.getCustomers();
  res.json(customers);
});

router.post('/', async (req, res) => {
  const customer = await dataService.createCustomer(req.body);
  res.status(201).json(customer);
});

router.put('/:id', async (req, res) => {
  const customer = await dataService.updateCustomer(req.params.id, req.body);
  res.json(customer);
});

router.delete('/:id', async (req, res) => {
  await dataService.deleteCustomer(req.params.id);
  res.status(204).send();
});

export default router;