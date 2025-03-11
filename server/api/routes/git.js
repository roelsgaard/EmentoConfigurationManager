import express from 'express';
const router = express.Router();
import { commands } from './../../commands.js'; 
import Customer from '../../model/customer.js';
import EffectiveConfiguration from '../../model/effectiveConfiguration.js';

// Git API
router.get('/branches', async (req, res) => {
  const branches = await commands.getBranches();
  res.json(branches);
});

router.get('/changes-count', async (req, res) => {
  const changesCount = await commands.getChangesCount();
  res.json(changesCount);
});

router.get('/changes', async (req, res) => {
  const changes = await commands.getChanges();
  res.json(changes);
});

router.post('/changes', async (req, res) => {
  const customers = await Customer.getCustomers();
  
  const errors = [];
  const configs = [];
  
  for await (const customer of customers) {
    const config = await EffectiveConfiguration.getEffectiveConfiguration('customer', customer.id);
    
    if(config._validation && !config._validation.isValid) {
       errors.push({
        customer, 
        validation: config._validation
      });
      continue;
    }

    configs.push({
      customer,
      config
    });
  };

  if(errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  await commands.saveConfigsToDir(configs);
  await commands.commitAndPushDatabase();
  await commands.commitAndPushConfigurations();

  res.json({ configs });
});

export default router;