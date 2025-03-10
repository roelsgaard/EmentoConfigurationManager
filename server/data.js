import set from 'lodash.set';

// Initial data
const data = {
  environments: [
    { id: '1', name: 'dk-prod', created_at: new Date().toISOString() },
    { id: '2', name: 'de-prod', created_at: new Date().toISOString() },
    { id: '3', name: 'guide', created_at: new Date().toISOString() }
  ],
  
  customers: [
    { id: '1', name: 'rm-auh', domain: 'rm-auh.emento.dk', environment_id: '1', created_at: new Date().toISOString() },
    { id: '2', name: 'rm-hev', domain: 'rm-hev.emento.dk', environment_id: '1', created_at: new Date().toISOString() },
    { id: '3', name: 'uker', domain: 'uker.emento.de', environment_id: '2', created_at: new Date().toISOString() },
    { id: '4', name: 'sak', domain: 'sak.emento.de', environment_id: '2', created_at: new Date().toISOString() },
    { id: '5', name: 'lanserhof-sylt', domain: 'lanserhof-sylt.emento.guide', environment_id: '3', created_at: new Date().toISOString() }
  ],

  services: [
    {
      id: '1',
      name: 'EmentoTrack',
      root_path: 'track',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'EmentoServer',
      root_path: 'server',
      created_at: new Date().toISOString()
    }
  ],

  modules: [
    {
      id: '1',
      name: 'Content Providers',
      description: 'Configuration for various content providers',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Universal Links',
      description: 'Configuration for universal links and deep linking',
      created_at: new Date().toISOString()
    }
  ],

  variables: [
    {
      name: "No Value Validation",
      type: "string",
      jsonPath: "test.noValue",
      description: "testing validation if global prop has no value",
      service_id: "1",
      id: "4ekepql2fasd",
      created_at: "2025-03-08T16:52:04.461Z",
      updated_at: "2025-03-08T16:52:04.461Z"
    },
    {
      name: "types",
      type: "array",
      defaultValue: ["video", "image", "episerver"],
      jsonPath: "contentProviders.ementoMedia.types",
      description: "Imported from JSON: types",
      service_id: "2",
      module_id: "1",
      id: "4ekepql2f",
      created_at: "2025-03-08T16:52:04.461Z",
      updated_at: "2025-03-08T16:52:04.461Z"
    },
    {
      name: "url",
      type: "string",
      defaultValue: "https://staging-customer1.emento.dk/media",
      jsonPath: "contentProviders.ementoMedia.url",
      description: "Imported from JSON: url",
      service_id: "2",
      module_id: "1",
      id: "0iw2qk3oc",
      created_at: "2025-03-08T16:52:04.467Z",
      updated_at: "2025-03-08T16:52:04.467Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.ementoQuestion.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "vx5elac6w",
      created_at: "2025-03-08T16:52:04.478Z",
      updated_at: "2025-03-08T16:52:04.478Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.geoFence.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "3epa7jrew",
      created_at: "2025-03-08T16:52:04.489Z",
      updated_at: "2025-03-08T16:52:04.489Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.journl.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "rx0a1ec4t",
      created_at: "2025-03-08T16:52:04.498Z",
      updated_at: "2025-03-08T16:52:04.498Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.meedio.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "kx42a9xz2",
      created_at: "2025-03-08T16:52:04.509Z",
      updated_at: "2025-03-08T16:52:04.509Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.signature.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "0r6rqw0yt",
      created_at: "2025-03-08T16:52:04.519Z",
      updated_at: "2025-03-08T16:52:04.519Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.surveyXact.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "dqkdm7u6u",
      created_at: "2025-03-08T16:52:04.529Z",
      updated_at: "2025-03-08T16:52:04.529Z"
    },
    {
      name: "url",
      type: "string",
      defaultValue: "https://emento-development.23video.com",
      jsonPath: "contentProviders.video23Config.url",
      description: "Imported from JSON: url",
      service_id: "2",
      module_id: "1",
      id: "uwir09hu8",
      created_at: "2025-03-08T16:52:04.538Z",
      updated_at: "2025-03-08T16:52:04.538Z"
    },
    {
      name: "customerLinkCountry",
      type: "string",
      defaultValue: "dk",
      jsonPath: "universalLinks.customerLinkCountry",
      description: "Imported from JSON: customerLinkCountry",
      service_id: "1",
      module_id: "2",
      id: "6soa7mvsw",
      created_at: "2025-03-08T16:55:01.294Z",
      updated_at: "2025-03-08T16:55:01.294Z"
    },
    {
      name: "customerLinkDomain",
      type: "string",
      defaultValue: "staging-verify-customerlink.emento.dk",
      jsonPath: "universalLinks.customerLinkDomain",
      description: "Imported from JSON: customerLinkDomain",
      service_id: "1",
      module_id: "2",
      id: "96e7i3nfc",
      created_at: "2025-03-08T16:55:01.304Z",
      updated_at: "2025-03-08T16:55:01.304Z"
    },
    {
      name: "customerLinkMode",
      type: "string",
      defaultValue: "citizen",
      jsonPath: "universalLinks.customerLinkMode",
      description: "Imported from JSON: customerLinkMode",
      service_id: "1",
      module_id: "2",
      id: "vss9q97nf",
      created_at: "2025-03-08T16:55:01.314Z",
      updated_at: "2025-03-08T16:55:01.314Z"
    }
  ],

  values: [],
  hiddenVariables: []
};

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

  const customer = data.customers.find(c => c.id === entityId);
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
    const customer = data.customers.find(c => c.id === entityId);
    if (customer) {
      environmentId = customer.environment_id;
    }
  }

  // Get hidden variables for this context
  const hiddenVariableIds = new Set(
    data.hiddenVariables
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
    const service = data.services.find(s => s.id === variable.service_id);
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
      data.hiddenVariables,
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
          service: data.services.find(s => s.id === v.service_id)?.name || 'Unknown Service'
        }))
      };
    }
  }

  return config;
};

export const dataService = {
  // Modules
  getModules: () => Promise.resolve([...data.modules]),

  createModule: async (module) => {
    const now = new Date().toISOString();
    const newModule = {
      ...module,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    data.modules.push(newModule);
    return newModule;
  },

  updateModule: async (moduleId, updates) => {
    const module = data.modules.find(m => m.id === moduleId);
    if (!module) {
      throw new Error('Module not found');
    }
    Object.assign(module, updates);
    return module;
  },

  deleteModule: async (moduleId) => {
    const index = data.modules.findIndex(m => m.id === moduleId);
    if (index !== -1) {
      data.modules.splice(index, 1);
      
      // Update variables to remove module_id
      data.variables.forEach(variable => {
        if (variable.module_id === moduleId) {
          delete variable.module_id;
        }
      });
      
      return true;
    }
    return false;
  },

  // Hidden Variables
  getHiddenVariables: () => Promise.resolve([...data.hiddenVariables]),

  setVariableHidden: async (variableId, level, entityId, hidden) => {
    const existingIndex = data.hiddenVariables.findIndex(h => 
      h.variable_id === variableId &&
      h.level === level &&
      h.entity_id === entityId
    );

    if (hidden) {
      if (existingIndex === -1) {
        data.hiddenVariables.push({
          variable_id: variableId,
          level,
          entity_id: entityId
        });
      }
    } else {
      if (existingIndex !== -1) {
        data.hiddenVariables.splice(existingIndex, 1);
      }
    }

    return true;
  },

  // Environments
  getEnvironments: () => Promise.resolve([...data.environments]),
  
  createEnvironment: async (environment) => {
    const now = new Date().toISOString();
    const newEnvironment = {
      ...environment,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    data.environments.push(newEnvironment);
    return newEnvironment;
  },

  updateEnvironment: async (environmentId, updates) => {
    const environment = data.environments.find(e => e.id === environmentId);
    if (!environment) {
      throw new Error('Environment not found');
    }
    Object.assign(environment, updates);
    return environment;
  },

  deleteEnvironment: async (environmentId) => {
    // Delete all customers in this environment
    data.customers = data.customers.filter(c => c.environment_id !== environmentId);
    
    // Delete all environment values
    data.values = data.values.filter(v => 
      !(v.level === 'environment' && v.entity_id === environmentId)
    );

    // Delete the environment
    const index = data.environments.findIndex(e => e.id === environmentId);
    if (index !== -1) {
      data.environments.splice(index, 1);
      return true;
    }
    return false;
  },

  // Services
  getServices: () => Promise.resolve([...data.services]),
  
  createService: async (service) => {
    const now = new Date().toISOString();
    const newService = {
      ...service,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    data.services.push(newService);
    return newService;
  },

  updateService: async (serviceId, updates) => {
    const service = data.services.find(s => s.id === serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    Object.assign(service, updates);
    return service;
  },

  deleteService: async (serviceId) => {
    // Delete all variables in this service
    const variableIds = data.variables
      .filter(v => v.service_id === serviceId)
      .map(v => v.id);
    
    // Delete all values for these variables
    data.values = data.values.filter(v => !variableIds.includes(v.variable_id));
    
    // Delete the variables
    data.variables = data.variables.filter(v => v.service_id !== serviceId);

    // Delete the service
    const index = data.services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
      data.services.splice(index, 1);
      return true;
    }
    return false;
  },

  // Customers
  getCustomers: () => Promise.resolve([...data.customers]),
  
  createCustomer: async (customer) => {
    const now = new Date().toISOString();
    const newCustomer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    data.customers.push(newCustomer);
    return newCustomer;
  },

  updateCustomer: async (customerId, updates) => {
    const customer = data.customers.find(c => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    Object.assign(customer, updates);
    return customer;
  },

  deleteCustomer: async (customerId) => {
    // Delete all customer values
    data.values = data.values.filter(v => 
      !(v.level === 'customer' && v.entity_id === customerId)
    );

    // Delete the customer
    const index = data.customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      data.customers.splice(index, 1);
      return true;
    }
    return false;
  },

  // Variables
  getVariables: () => Promise.resolve([...data.variables]),
  
  createVariable: async (variable) => {
    const now = new Date().toISOString();
    const newVariable = {
      ...variable,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now,
      updated_at: now
    };
    data.variables.push(newVariable);
    return newVariable;
  },

  updateVariable: async (variableId, updates) => {
    const variable = data.variables.find(v => v.id === variableId);
    if (!variable) {
      throw new Error('Variable not found');
    }
    Object.assign(variable, updates, {
      updated_at: new Date().toISOString()
    });
    return variable;
  },

  deleteVariable: async (variableId) => {
    // Remove the variable
    const index = data.variables.findIndex(v => v.id === variableId);
    if (index !== -1) {
      data.variables.splice(index, 1);
      
      // Remove all associated values
      data.values = data.values.filter(v => v.variable_id !== variableId);
      
      return true;
    }
    return false;
  },

  // Values
  getValues: () => Promise.resolve([...data.values]),

  updateValue: async (value) => {
    const now = new Date().toISOString();
    
    const existingIndex = data.values.findIndex(v => 
      v.variable_id === value.variable_id &&
      v.level === value.level &&
      v.entity_id === value.entity_id
    );

    if (existingIndex !== -1) {
      // Update existing
      data.values[existingIndex] = {
        ...data.values[existingIndex],
        ...value,
        updated_at: now
      };
      return data.values[existingIndex];
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
    
    data.values.push(newValue);
    return newValue;
  },

  deleteValue: async (value) => {
    const index = data.values.findIndex(v => 
      v.variable_id === value.variable_id &&
      v.level === value.level &&
      v.entity_id === value.entity_id
    );

    if (index !== -1) {
      data.values.splice(index, 1);
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
    return buildEffectiveConfiguration(data.variables, data.values, level, entityId, serviceId);
  },

  // Get customer by domain
  getCustomerByDomain: async (domain) => {
    return data.customers.find(c => c.domain === domain) || null;
  },

  // Get service by root path
  getServiceByRootPath: async (rootPath) => {
    return data.services.find(s => s.root_path === rootPath) || null;
  },

  // Export validateConfiguration for use in other modules
  validateConfiguration
};