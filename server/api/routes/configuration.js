import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Domain-based Configuration
router.get('/:domain', async (req, res) => {
  const { domain } = req.params;
  const { validate } = req.query;
  
  const customer = await dataService.getCustomerByDomain(domain);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  if (!validate) {
    const config = dataService.getEffectiveConfiguration(
        'customer',
        customer.id
    );
    
    res.json(config);
  }

  // validate configuration
  const variables = await dataService.getVariables();
  const values = await dataService.getValues();
  const hiddenVariables = await dataService.getHiddenVariables();
  const services = await dataService.getServices();

  const validation = dataService.validateConfiguration(
    variables,
    values,
    hiddenVariables,
    'customer',
    customer.id
  );

  if (validation.isValid) {
    res.json({
      isValid: true
    });
  } else {
    res.json({
      isValid: false,
      missingVariables: validation.missingVariables.map(v => ({
        id: v.id,
        name: v.name,
        jsonPath: v.jsonPath,
        service: services.find(s => s.id === v.service_id)?.name || 'Unknown Service'
      }))
    });
  }
});

router.get('/:domain/:service', async (req, res) => {
  const { domain, service } = req.params;
  
  const customer = await dataService.getCustomerByDomain(domain);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  // If root_path is provided, find the corresponding service
  let serviceId = null;
  if (service) {
    const serviceObj = await dataService.getServiceByRootPath(service);
    if (!serviceObj) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    serviceId = serviceObj.id;
  }

  const config = dataService.getEffectiveConfiguration(
    'customer',
    customer.id,
    serviceId
  );
  
  res.json(config);
});

export default router;