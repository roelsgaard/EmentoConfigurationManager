import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add error handling wrapper
const handleRequest = async (request) => {
  try {
    return await request;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};

export const dataService = {
  // Modules
  getModules: async () => {
    return handleRequest(
      api.get('/modules').then(response => response.data)
    );
  },

  createModule: async (module) => {
    return handleRequest(
      api.post('/modules', module).then(response => response.data)
    );
  },

  updateModule: async (moduleId, updates) => {
    return handleRequest(
      api.put(`/modules/${moduleId}`, updates).then(response => response.data)
    );
  },

  deleteModule: async (moduleId) => {
    return handleRequest(
      api.delete(`/modules/${moduleId}`).then(() => true)
    );
  },

  // Hidden Variables
  getHiddenVariables: async () => {
    return handleRequest(
      api.get('/hidden-variables').then(response => response.data)
    );
  },

  setVariableHidden: async (variableId, level, entityId, hidden) => {
    return handleRequest(
      api.post('/hidden-variables', { variableId, level, entityId, hidden })
        .then(response => response.data)
    );
  },

  // Environments
  getEnvironments: async () => {
    return handleRequest(
      api.get('/environments').then(response => response.data)
    );
  },

  createEnvironment: async (environment) => {
    return handleRequest(
      api.post('/environments', environment).then(response => response.data)
    );
  },

  updateEnvironment: async (environmentId, updates) => {
    return handleRequest(
      api.put(`/environments/${environmentId}`, updates).then(response => response.data)
    );
  },

  deleteEnvironment: async (environmentId) => {
    return handleRequest(
      api.delete(`/environments/${environmentId}`).then(() => true)
    );
  },

  // Services
  getServices: async () => {
    return handleRequest(
      api.get('/services').then(response => response.data)
    );
  },

  createService: async (service) => {
    return handleRequest(
      api.post('/services', service).then(response => response.data)
    );
  },

  updateService: async (serviceId, updates) => {
    return handleRequest(
      api.put(`/services/${serviceId}`, updates).then(response => response.data)
    );
  },

  deleteService: async (serviceId) => {
    return handleRequest(
      api.delete(`/services/${serviceId}`).then(() => true)
    );
  },

  // Customers
  getCustomers: async () => {
    return handleRequest(
      api.get('/customers').then(response => response.data)
    );
  },

  createCustomer: async (customer) => {
    return handleRequest(
      api.post('/customers', customer).then(response => response.data)
    );
  },

  updateCustomer: async (customerId, updates) => {
    return handleRequest(
      api.put(`/customers/${customerId}`, updates).then(response => response.data)
    );
  },

  deleteCustomer: async (customerId) => {
    return handleRequest(
      api.delete(`/customers/${customerId}`).then(() => true)
    );
  },

  // Variables
  getVariables: async () => {
    return handleRequest(
      api.get('/variables').then(response => response.data)
    );
  },

  createVariable: async (variable) => {
    return handleRequest(
      api.post('/variables', variable).then(response => response.data)
    );
  },

  updateVariable: async (variableId, updates) => {
    console.log('Updating variable:', variableId, updates); // Debug log
    return handleRequest(
      api.put(`/variables/${variableId}`, updates).then(response => {
        console.log('Update response:', response.data); // Debug log
        return response.data;
      })
    );
  },

  deleteVariable: async (variableId) => {
    return handleRequest(
      api.delete(`/variables/${variableId}`).then(() => true)
    );
  },

  // Values
  getValues: async () => {
    return handleRequest(
      api.get('/values').then(response => response.data)
    );
  },

  updateValue: async (value) => {
    return handleRequest(
      api.post('/values', value).then(response => response.data)
    );
  },

  deleteValue: async (value) => {
    if (!value.variable_id || !value.level) {
      throw new Error('Missing required parameters for deleting value');
    }

    // Handle null entity_id by using a special string
    const entityIdParam = value.entity_id === null ? '_null_' : value.entity_id;
    
    return handleRequest(
      api.delete(`/values/${value.variable_id}/${value.level}/${entityIdParam}`).then(() => true)
    );
  },

  // Get effective configuration
  getEffectiveConfiguration: async (
    level = null,
    entityId = null,
    serviceId = null
  ) => {
    return handleRequest(
      api.get('/effective-configuration', {
        params: { level, entityId, serviceId }
      }).then(response => response.data)
    );
  },

  getBranches: async () => {
    return handleRequest(
      api.get('/git/branches').then(response => response.data)
    );
  },

  getChangesCount: async () => {
    return handleRequest(
      api.get('/git/changes-count').then(response => response.data)
    );
  },

  getChanges: async () => {
    return handleRequest(
      api.get('/git/changes').then(response => response.data)
    );
  },

  saveChanges: async () => {
    return handleRequest(
      api.post('/git/changes').then(response => response.data)
    );
  }
};