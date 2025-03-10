import express from 'express';
import cors from 'cors';
import { dataService } from './data.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Modules
app.get('/api/modules', asyncHandler(async (req, res) => {
  const modules = await dataService.getModules();
  res.json(modules);
}));

app.post('/api/modules', asyncHandler(async (req, res) => {
  const module = await dataService.createModule(req.body);
  res.status(201).json(module);
}));

app.put('/api/modules/:id', asyncHandler(async (req, res) => {
  const module = await dataService.updateModule(req.params.id, req.body);
  res.json(module);
}));

app.delete('/api/modules/:id', asyncHandler(async (req, res) => {
  await dataService.deleteModule(req.params.id);
  res.status(204).send();
}));

// Hidden Variables
app.get('/api/hidden-variables', asyncHandler(async (req, res) => {
  const hiddenVariables = await dataService.getHiddenVariables();
  res.json(hiddenVariables);
}));

app.post('/api/hidden-variables', asyncHandler(async (req, res) => {
  const { variableId, level, entityId, hidden } = req.body;
  await dataService.setVariableHidden(variableId, level, entityId, hidden);
  res.status(200).json({ success: true });
}));

// Environments
app.get('/api/environments', asyncHandler(async (req, res) => {
  const environments = await dataService.getEnvironments();
  res.json(environments);
}));

app.post('/api/environments', asyncHandler(async (req, res) => {
  const environment = await dataService.createEnvironment(req.body);
  res.status(201).json(environment);
}));

app.put('/api/environments/:id', asyncHandler(async (req, res) => {
  const environment = await dataService.updateEnvironment(req.params.id, req.body);
  res.json(environment);
}));

app.delete('/api/environments/:id', asyncHandler(async (req, res) => {
  await dataService.deleteEnvironment(req.params.id);
  res.status(204).send();
}));

// Services
app.get('/api/services', asyncHandler(async (req, res) => {
  const services = await dataService.getServices();
  res.json(services);
}));

app.post('/api/services', asyncHandler(async (req, res) => {
  const service = await dataService.createService(req.body);
  res.status(201).json(service);
}));

app.put('/api/services/:id', asyncHandler(async (req, res) => {
  const service = await dataService.updateService(req.params.id, req.body);
  res.json(service);
}));

app.delete('/api/services/:id', asyncHandler(async (req, res) => {
  await dataService.deleteService(req.params.id);
  res.status(204).send();
}));

// Customers
app.get('/api/customers', asyncHandler(async (req, res) => {
  const customers = await dataService.getCustomers();
  res.json(customers);
}));

app.post('/api/customers', asyncHandler(async (req, res) => {
  const customer = await dataService.createCustomer(req.body);
  res.status(201).json(customer);
}));

app.put('/api/customers/:id', asyncHandler(async (req, res) => {
  const customer = await dataService.updateCustomer(req.params.id, req.body);
  res.json(customer);
}));

app.delete('/api/customers/:id', asyncHandler(async (req, res) => {
  await dataService.deleteCustomer(req.params.id);
  res.status(204).send();
}));

// Variables
app.get('/api/variables', asyncHandler(async (req, res) => {
  const variables = await dataService.getVariables();
  res.json(variables);
}));

app.post('/api/variables', asyncHandler(async (req, res) => {
  const variable = await dataService.createVariable(req.body);
  res.status(201).json(variable);
}));

app.put('/api/variables/:id', asyncHandler(async (req, res) => {
  const variable = await dataService.updateVariable(req.params.id, req.body);
  res.json(variable);
}));

app.delete('/api/variables/:id', asyncHandler(async (req, res) => {
  await dataService.deleteVariable(req.params.id);
  res.status(204).send();
}));

// Values
app.get('/api/values', asyncHandler(async (req, res) => {
  const values = await dataService.getValues();
  res.json(values);
}));

app.post('/api/values', asyncHandler(async (req, res) => {
  const value = await dataService.updateValue(req.body);
  res.status(201).json(value);
}));

app.delete('/api/values/:variableId/:level/:entityId', asyncHandler(async (req, res) => {
  const { variableId, level, entityId } = req.params;
  
  try {
    await dataService.deleteValue({
      variable_id: variableId,
      level,
      entity_id: entityId === '_null_' ? null : entityId
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting value:', error);
    if (error.message === 'Value not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}));

// Effective Configuration
app.get('/api/effective-configuration', asyncHandler(async (req, res) => {
  const { level, entityId, serviceId } = req.query;
  const config = dataService.getEffectiveConfiguration(
    level || null,
    entityId === 'null' ? null : entityId,
    serviceId === 'null' ? null : serviceId
  );
  res.json(config);
}));

// Domain-based Configuration
app.get('/api/configuration/:domain', asyncHandler(async (req, res) => {
  const { domain } = req.params;
  
  const customer = await dataService.getCustomerByDomain(domain);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  const config = dataService.getEffectiveConfiguration(
    'customer',
    customer.id
  );
  
  res.json(config);
}));

app.get('/api/configuration/:domain/:service', asyncHandler(async (req, res) => {
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
}));

// Configuration Validation
app.get('/api/configuration-validate/:domain', asyncHandler(async (req, res) => {
  const { domain } = req.params;
  
  const customer = await dataService.getCustomerByDomain(domain);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

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
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'An unexpected error occurred'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});