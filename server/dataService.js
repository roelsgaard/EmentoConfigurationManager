import set from 'lodash.set';
//import { data } from './data.js';
import { JSONFilePreset } from 'lowdb/node'

const databaseFilename = './database/db.json';
const db = await JSONFilePreset(databaseFilename, {});

// Helper function to check if a value is effectively empty based on its type
const isValueEmpty = (value, type) => {
  if (value === undefined || value === null) return true;
  
  switch (type) {
    case 'string':
      return value === '';
    case 'array':
      return Array.isArray(value) && value.length === 0;
    case 'object':
      return Object.keys(value).length === 0;
    default:
      return false;
  }
};

// Helper function to check if a variable has a value set at any level
const hasValueAtAnyLevel = (variable, values, level, entityId, environmentId = null) => {
  // Get the most specific value that applies
  let effectiveValue = variable.defaultValue;

  // Check global level
  const globalValue = values.find(v => 
    v.variable_id === variable.id && 
    v.level === 'global'
  );
  if (globalValue) {
    effectiveValue = globalValue.value;
  }

  // If we're at customer level, also check environment level
  if (level === 'customer' && environmentId) {
    const environmentValue = values.find(v =>
      v.variable_id === variable.id &&
      v.level === 'environment' &&
      v.entity_id === environmentId
    );
    if (environmentValue) {
      effectiveValue = environmentValue.value;
    }
  }

  // Check current level
  if (level && entityId) {
    const currentLevelValue = values.find(v =>
      v.variable_id === variable.id &&
      v.level === level &&
      v.entity_id === entityId
    );
    if (currentLevelValue) {
      effectiveValue = currentLevelValue.value;
    }
  }

  // Check if the effective value is empty
  return !isValueEmpty(effectiveValue, variable.type);
};

// Helper function to check if a variable is hidden
const isVariableHidden = (variable, hiddenVariables, level, entityId) => {
  return hiddenVariables.some(h =>
    h.variable_id === variable.id &&
    h.level === level &&
    h.entity_id === entityId
  );
};

// Helper function to validate configuration
const validateConfiguration = (variables, values, hiddenVariables, level, entityId) => {
  if (level !== 'customer') return { isValid: true, missingVariables: [] };

  const customer = db.data.customers.find(c => c.id === entityId);
  if (!customer) return { isValid: false, missingVariables: [] };

  const missingVariables = variables.filter(variable => {
    const hasValue = hasValueAtAnyLevel(variable, values, level, entityId, customer.environment_id);
    const isHidden = isVariableHidden(variable, hiddenVariables, level, entityId);
    return !hasValue && !isHidden;
  });

  return {
    isValid: missingVariables.length === 0,
    missingVariables
  };
};

// Helper function to build effective configuration
const buildEffectiveConfiguration = (
  variables,
  values,
  level = null,
  entityId = null,
  serviceId = null
) => {
  let config = {};

  // Filter variables by service if specified
  const filteredVariables = serviceId 
    ? variables.filter(v => v.service_id === serviceId)
    : variables;

  // If we're looking up customer config, find its environment
  let environmentId = null;
  if (level === 'customer') {
    const customer = db.data.customers.find(c => c.id === entityId);
    if (customer) {
      environmentId = customer.environment_id;
    }
  }

  // Get hidden variables for this context
  const hiddenVariableIds = new Set(
    db.data.hiddenVariables
      .filter(h => h.level === level && h.entity_id === entityId)
      .map(h => h.variable_id)
  );

  filteredVariables.forEach(variable => {
    // Skip if variable is hidden in this context
    if (hiddenVariableIds.has(variable.id)) {
      return;
    }

    let effectiveValue = variable.defaultValue;

    // Find global override
    const globalValue = values.find(v => 
      v.variable_id === variable.id && 
      v.level === 'global'
    );
    if (globalValue) {
      effectiveValue = globalValue.value;
    }

    // Find environment override
    if (level === 'environment' || level === 'customer') {
      const envValue = values.find(v =>
        v.variable_id === variable.id &&
        v.level === 'environment' &&
        v.entity_id === (level === 'customer' ? environmentId : entityId)
      );
      if (envValue) {
        effectiveValue = envValue.value;
      }
    }

    // Find customer override
    if (level === 'customer') {
      const custValue = values.find(v =>
        v.variable_id === variable.id &&
        v.level === 'customer' &&
        v.entity_id === entityId
      );
      if (custValue) {
        effectiveValue = custValue.value;
      }
    }

    // Get the service's root path
    const service = db.data.services.find(s => s.id === variable.service_id);
    const rootPath = service?.root_path || '';
    
    // Combine root path with variable's JSON path
    const fullPath = rootPath ? `${rootPath}.${variable.jsonPath}` : variable.jsonPath;
    set(config, fullPath, effectiveValue);
  });

  // If this is a customer configuration, validate it
  if (level === 'customer') {
    const validation = validateConfiguration(
      filteredVariables,
      values,
      db.data.hiddenVariables,
      level,
      entityId
    );

    if (!validation.isValid) {
      config._validation = {
        isValid: false,
        missingVariables: validation.missingVariables.map(v => ({
          id: v.id,
          name: v.name,
          jsonPath: v.jsonPath,
          service: db.data.services.find(s => s.id === v.service_id)?.name || 'Unknown Service'
        }))
      };
    }
  }

  return config;
};

export const dataService = {
  // Modules
  getModules: () => Promise.resolve([...db.data.modules]),

  createModule: async (module) => {
    const now = new Date().toISOString();
    const newModule = {
      ...module,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    db.data.modules.push(newModule);
    db.write();
    return newModule;
  },

  updateModule: async (moduleId, updates) => {
    const module = db.data.modules.find(m => m.id === moduleId);
    if (!module) {
      throw new Error('Module not found');
    }
    Object.assign(module, updates);
    db.write();
    return module;
  },

  deleteModule: async (moduleId) => {
    const index = db.data.modules.findIndex(m => m.id === moduleId);
    if (index !== -1) {
      db.data.modules.splice(index, 1);
      
      // Update variables to remove module_id
      db.data.variables.forEach(variable => {
        if (variable.module_id === moduleId) {
          delete variable.module_id;
        }
      });
      
      db.write();
      return true;
    }
    return false;
  },

  // Hidden Variables
  getHiddenVariables: () => Promise.resolve([...db.data.hiddenVariables]),

  setVariableHidden: async (variableId, level, entityId, hidden) => {
    const existingIndex = db.data.hiddenVariables.findIndex(h => 
      h.variable_id === variableId &&
      h.level === level &&
      h.entity_id === entityId
    );

    if (hidden) {
      if (existingIndex === -1) {
        db.data.hiddenVariables.push({
          variable_id: variableId,
          level,
          entity_id: entityId
        });
      }
    } else {
      if (existingIndex !== -1) {
        db.data.hiddenVariables.splice(existingIndex, 1);
      }
    }

    db.write();
    return true;
  },

  // Environments
  getEnvironments: () => Promise.resolve([...db.data.environments]),
  
  createEnvironment: async (environment) => {
    const now = new Date().toISOString();
    const newEnvironment = {
      ...environment,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    db.data.environments.push(newEnvironment);
    db.write();
    return newEnvironment;
  },

  updateEnvironment: async (environmentId, updates) => {
    const environment = db.data.environments.find(e => e.id === environmentId);
    if (!environment) {
      throw new Error('Environment not found');
    }
    Object.assign(environment, updates);
    db.write();
    return environment;
  },

  deleteEnvironment: async (environmentId) => {
    // Delete all customers in this environment
    db.data.customers = db.data.customers.filter(c => c.environment_id !== environmentId);
    
    // Delete all environment values
    db.data.values = db.data.values.filter(v => 
      !(v.level === 'environment' && v.entity_id === environmentId)
    );

    // Delete the environment
    const index = db.data.environments.findIndex(e => e.id === environmentId);
    if (index !== -1) {
      db.data.environments.splice(index, 1);
      db.write();
      return true;
    }

    db.write();
    return false;
  },

  // Services
  getServices: () => Promise.resolve([...db.data.services]),
  
  createService: async (service) => {
    const now = new Date().toISOString();
    const newService = {
      ...service,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    db.data.services.push(newService);
    db.write();
    return newService;
  },

  updateService: async (serviceId, updates) => {
    const service = db.data.services.find(s => s.id === serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    Object.assign(service, updates);
    db.write();
    return service;
  },

  deleteService: async (serviceId) => {
    // Delete all variables in this service
    const variableIds = db.data.variables
      .filter(v => v.service_id === serviceId)
      .map(v => v.id);
    
    // Delete all values for these variables
    db.data.values = db.data.values.filter(v => !variableIds.includes(v.variable_id));
    
    // Delete the variables
    db.data.variables = db.data.variables.filter(v => v.service_id !== serviceId);

    // Delete the service
    const index = db.data.services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
      db.data.services.splice(index, 1);
      db.write();
      return true;
    }

    db.write();
    return false;
  },

  // Customers
  getCustomers: () => Promise.resolve([...db.data.customers]),
  
  createCustomer: async (customer) => {
    const now = new Date().toISOString();
    const newCustomer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    db.data.customers.push(newCustomer);
    db.write();
    return newCustomer;
  },

  updateCustomer: async (customerId, updates) => {
    const customer = db.data.customers.find(c => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    Object.assign(customer, updates);
    db.write();
    return customer;
  },

  deleteCustomer: async (customerId) => {
    // Delete all customer values
    db.data.values = db.data.values.filter(v => 
      !(v.level === 'customer' && v.entity_id === customerId)
    );

    // Delete the customer
    const index = db.data.customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      db.data.customers.splice(index, 1);
      db.write();
      return true;
    }

    db.write();
    return false;
  },

  // Variables
  getVariables: () => Promise.resolve([...db.data.variables]),
  
  createVariable: async (variable) => {
    const now = new Date().toISOString();
    const newVariable = {
      ...variable,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now,
      updated_at: now
    };
    db.data.variables.push(newVariable);
    db.write();
    return newVariable;
  },

  updateVariable: async (variableId, updates) => {
    const variable = db.data.variables.find(v => v.id === variableId);
    if (!variable) {
      throw new Error('Variable not found');
    }
    Object.assign(variable, updates, {
      updated_at: new Date().toISOString()
    });
    db.write();
    return variable;
  },

  deleteVariable: async (variableId) => {
    // Remove the variable
    const index = db.data.variables.findIndex(v => v.id === variableId);
    if (index !== -1) {
      db.data.variables.splice(index, 1);
      
      // Remove all associated values
      db.data.values = db.data.values.filter(v => v.variable_id !== variableId);
      
      db.write();
      return true;
    }
    return false;
  },

  // Values
  getValues: () => Promise.resolve([...db.data.values]),

  updateValue: async (value) => {
    const now = new Date().toISOString();
    
    const existingIndex = db.data.values.findIndex(v => 
      v.variable_id === value.variable_id &&
      v.level === value.level &&
      v.entity_id === value.entity_id
    );

    if (existingIndex !== -1) {
      // Update existing
      db.data.values[existingIndex] = {
        ...db.data.values[existingIndex],
        ...value,
        updated_at: now
      };
      return db.data.values[existingIndex];
    }

    // Create new
    const newValue = {
      id: Math.random().toString(36).substr(2, 9),
      variable_id: value.variable_id,
      level: value.level,
      entity_id: value.entity_id,
      value: value.value,
      created_at: now,
      updated_at: now
    };
    
    db.data.values.push(newValue);
    db.write();
    return newValue;
  },

  deleteValue: async (value) => {
    const index = db.data.values.findIndex(v => 
      v.variable_id === value.variable_id &&
      v.level === value.level &&
      v.entity_id === value.entity_id
    );

    if (index !== -1) {
      db.data.values.splice(index, 1);
      db.write();
      return true;
    }
    return false;
  },

  // Get effective configuration
  getEffectiveConfiguration: (
    level = null,
    entityId = null,
    serviceId = null
  ) => {
    return buildEffectiveConfiguration(db.data.variables, db.data.values, level, entityId, serviceId);
  },

  // Get customer by domain
  getCustomerByDomain: async (domain) => {
    return db.data.customers.find(c => c.domain === domain) || null;
  },

  // Get service by root path
  getServiceByRootPath: async (rootPath) => {
    return db.data.services.find(s => s.root_path === rootPath) || null;
  },

  // Export validateConfiguration for use in other modules
  validateConfiguration
};