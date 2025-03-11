import express from 'express';
const router = express.Router();
import { commands } from './../../commands.js'; 
import Customer from '../../model/customer.js';
import EffectiveConfiguration from '../../model/effectiveConfiguration.js';
import db from '../../database.js';

// Git API
router.get('/branches', async (req, res) => {
  const branches = await commands.getBranches();
  const current = await commands.getCurrentBranch();
  res.json({
    branches,
    current
  });
});

router.post('/change-branch', async (req, res) => {
  const { branch } = req.body;
  await commands.checkoutBranch(branch);
  
  db.read(); // reaload database since we are changing the branch
  
  res.json(branch);
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
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;