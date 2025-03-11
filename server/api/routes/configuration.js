import express from 'express';
const router = express.Router();
import Customer from '../../model/customer.js';
import Service from '../../model/service.js';
import EffectiveConfiguration from '../../model/effectiveConfiguration.js';
import Variable from '../../model/variable.js';
import Value from '../../model/value.js';
import HiddenVariable from '../../model/hiddenVariable.js';

// Domain-based Configuration
router.get('/:domain', async (req, res) => {
  const { domain } = req.params;
  const { validate } = req.query;
  
  const customer = await Customer.getCustomerByDomain(domain);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  if (!validate) {
    const config = await EffectiveConfiguration.getEffectiveConfiguration(
        'customer',
        customer.id
    );
    
    res.json(config);
  }

  // validate configuration
  const variables = await Variable.getVariables();
  const values = await Value.getValues();
  const hiddenVariables = await HiddenVariable.getHiddenVariables();
  const services = await Service.getServices();

  const validation = EffectiveConfiguration.validateConfiguration(
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
  
  const customer = await Customer.getCustomerByDomain(domain);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  // If root_path is provided, find the corresponding service
  let serviceId = null;
  if (service) {
    const serviceObj = await Service.getServiceByRootPath(service);
    if (!serviceObj) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    serviceId = serviceObj.id;
  }

  const config = await EffectiveConfiguration.getEffectiveConfiguration(
    'customer',
    customer.id,
    serviceId
  );
  
  res.json(config);
});

export default router;