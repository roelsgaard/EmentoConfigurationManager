import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Tooltip } from "react-tooltip";
import { dataService } from './lib/api';

// Components
import { Sidebar } from './components/Sidebar';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { AddEnvironmentModal } from './components/modals/AddEnvironmentModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { AddServiceModal } from './components/modals/AddServiceModal';
import { AddModuleModal } from './components/modals/AddModuleModal';
import { AddVariableModal } from './components/modals/AddVariableModal';
import { EditVariableModal } from './components/modals/EditVariableModal';
import { ImportJsonModal } from './components/modals/ImportJsonModal';
import { SelectVariableModal } from './components/modals/SelectVariableModal';
import { DeleteVariableModal } from './components/modals/DeleteVariableModal';

function App() {
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState('');
  const [changesCount, setChangesCount] = useState(0);
  const [showChanges, setShowChanges] = useState(false);
  const [changes, setChanges] = useState([]);
  const [savingChanges, setSavingChanges] = useState(false);
  const [environments, setEnvironments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [modules, setModules] = useState([]);
  const [variables, setVariables] = useState([]);
  const [values, setValues] = useState([]);
  const [effectiveConfiguration, setEffectiveConfiguration] = useState({});
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [isSelectingVariable, setIsSelectingVariable] = useState(false);
  const [isAddingEnvironment, setIsAddingEnvironment] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [isImportingJson, setIsImportingJson] = useState(false);
  const [jsonImport, setJsonImport] = useState('');
  const [jsonImportError, setJsonImportError] = useState(null);
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [environmentSearch, setEnvironmentSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');
  const [newEnvironment, setNewEnvironment] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', domain: '' });
  const [newService, setNewService] = useState({ name: '', root_path: '' });
  const [newModule, setNewModule] = useState({ name: '', description: '' });
  const [isDeletingVariable, setIsDeletingVariable] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState(null);
  const [isEditingVariable, setIsEditingVariable] = useState(false);
  const [editedVariable, setEditedVariable] = useState(null);
  const [newVariable, setNewVariable] = useState({
    name: '',
    type: 'string',
    defaultValue: '',
    jsonPath: '',
    description: '',
    service_id: '',
    module_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchEffectiveConfiguration();
  }, [selectedEnv, selectedCustomer, selectedService]);

  async function fetchData() {
    try {
      const [envs, custs, svcs, mods, vars, vals, branches, changesCount, changes] = await Promise.all([
        dataService.getEnvironments(),
        dataService.getCustomers(),
        dataService.getServices(),
        dataService.getModules(),
        dataService.getVariables(),
        dataService.getValues(),
        dataService.getBranches(),
        dataService.getChangesCount(),
        dataService.getChanges()
      ]);

      setEnvironments(envs);
      setCustomers(custs);
      setServices(svcs);
      setModules(mods);
      setVariables(vars);
      setValues(vals);
      setBranches(branches.branches);
      setCurrentBranch(branches.current);
      setChangesCount(changesCount);
      setChanges(changes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  async function fetchEffectiveConfiguration() {
    try {
      let level = null;
      let entityId = null;

      if (selectedCustomer) {
        level = 'customer';
        entityId = selectedCustomer;
      } else if (selectedEnv) {
        level = 'environment';
        entityId = selectedEnv;
      }

      const config = await dataService.getEffectiveConfiguration(
        level,
        entityId,
        selectedService
      );
      setEffectiveConfiguration(config);
    } catch (error) {
      console.error('Error fetching effective configuration:', error);
    }
  }

  const handleAddEnvironment = async () => {
    try {
      await dataService.createEnvironment({
        name: newEnvironment
      });
      await fetchData();
      setIsAddingEnvironment(false);
      setNewEnvironment('');
    } catch (error) {
      console.error('Error adding environment:', error);
    }
  };

  const handleAddCustomer = async () => {
    if (!selectedEnv) return;
    
    try {
      await dataService.createCustomer({
        name: newCustomer.name,
        domain: newCustomer.domain,
        environment_id: selectedEnv
      });
      await fetchData();
      setIsAddingCustomer(false);
      setNewCustomer({ name: '', domain: '' });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleAddService = async () => {
    try {
      await dataService.createService({
        name: newService.name,
        root_path: newService.root_path
      });
      await fetchData();
      setIsAddingService(false);
      setNewService({ name: '', root_path: '' });
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleAddModule = async () => {
    try {
      await dataService.createModule({
        name: newModule.name,
        description: newModule.description
      });
      await fetchData();
      setIsAddingModule(false);
      setNewModule({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleImportJson = async () => {
    try {
      setJsonImportError(null);
      const config = JSON.parse(jsonImport);
      
      const createVariablesFromJson = async (obj, path = '') => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            await createVariablesFromJson(value, currentPath);
          } else {
            const type = Array.isArray(value) ? 'array' : typeof value;
            
            await dataService.createVariable({
              name: key,
              type,
              defaultValue: value,
              jsonPath: currentPath,
              description: `Imported from JSON: ${key}`,
              service_id: selectedService,
              module_id: selectedModule
            });
          }
        }
      };

      await createVariablesFromJson(config);
      await fetchData();
      setIsImportingJson(false);
      setJsonImport('');
    } catch (error) {
      console.error('Error importing JSON:', error);
      setJsonImportError('Invalid JSON format. Please check your input.');
    }
  };

  const handleAddVariable = async () => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(newVariable.defaultValue);
        if (newVariable.type === 'array' && !Array.isArray(parsedValue)) {
          throw new Error('Value must be an array');
        }
      } catch (error) {
        if (newVariable.type === 'array') {
          parsedValue = [];
        } else {
          parsedValue = newVariable.defaultValue;
        }
      }

      await dataService.createVariable({
        name: newVariable.name,
        type: newVariable.type,
        defaultValue: parsedValue,
        jsonPath: newVariable.jsonPath,
        description: newVariable.description,
        service_id: newVariable.service_id,
        module_id: newVariable.module_id
      });
      
      await fetchData();
      setIsAddingVariable(false);
      setNewVariable({
        name: '',
        type: 'string',
        defaultValue: '',
        jsonPath: '',
        description: '',
        service_id: '',
        module_id: ''
      });
    } catch (error) {
      console.error('Error adding variable:', error);
    }
  };

  const handleAddOverride = async (variableId) => {
    try {
      const variable = variables.find(v => v.id === variableId);
      if (!variable) return;

      let level = 'environment';
      let entityId = selectedEnv;

      if (selectedCustomer) {
        level = 'customer';
        entityId = selectedCustomer;
      }

      await dataService.updateValue({
        variable_id: variableId,
        level,
        entity_id: entityId,
        value: variable.defaultValue
      });

      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
      setIsSelectingVariable(false);
    } catch (error) {
      console.error('Error adding override:', error);
    }
  };

  const handleStartEditing = (variable) => {
    const currentValue = getCurrentValue(variable);
    setEditingVariable(variable);
    setEditingValue(JSON.stringify(currentValue, null, 2));
    setIsEditingValue(true);
  };

  const handleEditVariable = (variable) => {
    setEditedVariable({
      ...variable,
      defaultValue: typeof variable.defaultValue === 'object' 
        ? JSON.stringify(variable.defaultValue) 
        : variable.defaultValue
    });
    setIsEditingVariable(true);
  };

  const handleUpdateVariable = async () => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(editedVariable.defaultValue);
        if (editedVariable.type === 'array' && !Array.isArray(parsedValue)) {
          throw new Error('Value must be an array');
        }
      } catch (error) {
        if (editedVariable.type === 'array') {
          parsedValue = [];
        } else {
          parsedValue = editedVariable.defaultValue;
        }
      }

      const updatedVariable = {
        ...editedVariable,
        defaultValue: parsedValue
      };

      await dataService.updateVariable(editedVariable.id, updatedVariable);
      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
      setIsEditingVariable(false);
      setEditedVariable(null);
    } catch (error) {
      console.error('Error updating variable:', error);
    }
  };

  const handleUpdateValue = async (variable) => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(editingValue);
        if (variable.type === 'array' && !Array.isArray(parsedValue)) {
          throw new Error('Value must be an array');
        }
      } catch (error) {
        if (variable.type === 'array') {
          parsedValue = [];
        } else {
          parsedValue = editingValue;
        }
      }

      let level = 'global';
      let entityId = null;

      if (selectedCustomer) {
        level = 'customer';
        entityId = selectedCustomer;
      } else if (selectedEnv) {
        level = 'environment';
        entityId = selectedEnv;
      }

      await dataService.updateValue({
        variable_id: variable.id,
        level,
        entity_id: entityId,
        value: parsedValue
      });

      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
      setIsEditingValue(false);
      setEditingVariable(null);
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };

  const handleDeleteVariable = async () => {
    if (!variableToDelete) return;

    try {
      await dataService.deleteVariable(variableToDelete.id);
      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
      setIsDeletingVariable(false);
      setVariableToDelete(null);
    } catch (error) {
      console.error('Error deleting variable:', error);
    }
  };

  const handleDeleteOverride = async (variable) => {
    try {
      let level = 'environment';
      let entityId = selectedEnv;

      if (selectedCustomer) {
        level = 'customer';
        entityId = selectedCustomer;
      }

      await dataService.deleteValue({
        variable_id: variable.id,
        level,
        entity_id: entityId
      });

      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
    } catch (error) {
      console.error('Error deleting override:', error);
    }
  };

  const handleDeleteEnvironment = async (environmentId) => {
    try {
      await dataService.deleteEnvironment(environmentId);
      if (selectedEnv === environmentId) {
        setSelectedEnv(null);
        setSelectedCustomer(null);
      }
      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
    } catch (error) {
      console.error('Error deleting environment:', error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await dataService.deleteCustomer(customerId);
      if (selectedCustomer === customerId) {
        setSelectedCustomer(null);
      }
      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await dataService.deleteService(serviceId);
      if (selectedService === serviceId) {
        setSelectedService(null);
      }
      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await dataService.deleteModule(moduleId);
      if (selectedModule === moduleId) {
        setSelectedModule(null);
      }
      await Promise.all([fetchData(), fetchEffectiveConfiguration()]);
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const getCurrentValue = (variable) => {
    let level = 'global';
    let entityId = null;

    if (selectedCustomer) {
      level = 'customer';
      entityId = selectedCustomer;
    } else if (selectedEnv) {
      level = 'environment';
      entityId = selectedEnv;
    }

    const value = values.find(v => 
      v.variable_id === variable.id &&
      v.level === level &&
      v.entity_id === entityId
    );

    return value ? value.value : variable.defaultValue;
  };

  const getOverriddenVariables = () => {
    let level = 'environment';
    let entityId = selectedEnv;

    if (selectedCustomer) {
      level = 'customer';
      entityId = selectedCustomer;
    }

    return variables.filter(variable => 
      values.some(v => 
        v.variable_id === variable.id &&
        v.level === level &&
        v.entity_id === entityId
      )
    );
  };

  const getAvailableVariables = () => {
    const overriddenIds = new Set(getOverriddenVariables().map(v => v.id));
    return variables.filter(v => !overriddenIds.has(v.id));
  };

  const handleCustomerSelect = (customerId) => {
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setSelectedEnv(customer.environment_id);
        setSelectedCustomer(customerId);
      }
    } else {
      setSelectedCustomer(null);
    }
  };

  const handleUpdateEnvironment = async (environmentId, updates) => {
    try {
      await dataService.updateEnvironment(environmentId, updates);
      await fetchData();
    } catch (error) {
      console.error('Error updating environment:', error);
    }
  };

  const handleUpdateCustomer = async (customerId, updates) => {
    try {
      await dataService.updateCustomer(customerId, updates);
      await fetchData();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleUpdateService = async (serviceId, updates) => {
    try {
      await dataService.updateService(serviceId, updates);
      await fetchData();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleUpdateModule = async (moduleId, updates) => {
    try {
      await dataService.updateModule(moduleId, updates);
      await fetchData();
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const isGlobalLevel = !selectedEnv && !selectedCustomer;
  const filteredVariables = selectedService
    ? variables.filter(v => v.service_id === selectedService)
    : variables;
  const overriddenVariables = getOverriddenVariables().filter(v => 
    selectedService ? v.service_id === selectedService : true
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Configuration Management
          </h1>
          <div className="flex items-baseline gap-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 inline">Branch: </label>
            <select 
              className="w-64 p-2 border border-gray-300 rounded"
              disabled={savingChanges || changesCount > 0}
              value={currentBranch}
              onChange={async (e) => {
                const branch = e.target.value;
                await dataService.changeBranch(branch);
                await fetchData();
              }}
            >
              {branches && branches.map(branch => (
                <option key={branch}>{branch}</option>
              ))}
            </select>
            <span className="text-sm font-medium text-gray-700 inline">Changes:</span>
            
            <span 
              className="text-sm font-medium text-gray-700 inline"
              data-tooltip-id="changes-tooltip"
              onMouseOver={async () => {
                const changes = await dataService.getChanges();
                setChanges(changes);
                setShowChanges(true);
              }}
              onMouseLeave={() => setShowChanges(false)}
            >{changesCount}</span>
            
            <button
                onClick={async () => {
                  const changesCount = await dataService.getChangesCount();
                  setChangesCount(changesCount);

                  const changes = await dataService.getChanges();
                  setChanges(changes);
                }}
                className="text-gray-500 hover:text-blue-600 rounded self-center"
                title="Refresh changes"
              >
                <RefreshCw className="w-4 h-4" />
            </button>

            <Tooltip
              id="changes-tooltip"
              place="bottom"
              variant="dark"
              style={{zIndex: 9999}}
              content={
                <ul className={`text-white text-sm font-medium
                  ${showChanges ? '' : 'hidden'}`}>
                    {changes?.map(c => (
                      <li key={c.file}>{c.status} {c.file}</li>
                    ))}
              </ul>
              }
            />
            
            <button
              onClick={async () => {
                try {
                  setSavingChanges(true);
                  const res = await dataService.saveChanges();
                  
                  const changesCount = await dataService.getChangesCount();
                  setChangesCount(changesCount);

                  const changes = await dataService.getChanges();
                  setChanges(changes);

                  setSavingChanges(false);
                } catch (error) {
                  console.error('Error saving changes:', error);
                  setSavingChanges(false);
                }
              }}
              disabled={changesCount <= 0 || savingChanges}
              className={`px-4 py-2 rounded ${
                changesCount > 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {savingChanges ? 'Saving...' : 'Save Changes'}
              {savingChanges && (
                <svg
                  className="animate-spin h-5 w-5 text-white ml-2 inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 12a10 10 0 0110-10V0C4.477 0 0 4.477 0 10h2z"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Sidebar
            environments={environments}
            customers={customers}
            services={services}
            modules={modules}
            selectedEnv={selectedEnv}
            selectedCustomer={selectedCustomer}
            selectedService={selectedService}
            selectedModule={selectedModule}
            environmentSearch={environmentSearch}
            customerSearch={customerSearch}
            serviceSearch={serviceSearch}
            moduleSearch={moduleSearch}
            onEnvironmentSearchChange={setEnvironmentSearch}
            onCustomerSearchChange={setCustomerSearch}
            onServiceSearchChange={setServiceSearch}
            onModuleSearchChange={setModuleSearch}
            onEnvironmentSelect={setSelectedEnv}
            onCustomerSelect={handleCustomerSelect}
            onServiceSelect={setSelectedService}
            onModuleSelect={setSelectedModule}
            onAddEnvironment={() => setIsAddingEnvironment(true)}
            onAddCustomer={() => setIsAddingCustomer(true)}
            onAddService={() => setIsAddingService(true)}
            onAddModule={() => setIsAddingModule(true)}
            onDeleteEnvironment={handleDeleteEnvironment}
            onDeleteCustomer={handleDeleteCustomer}
            onDeleteService={handleDeleteService}
            onDeleteModule={handleDeleteModule}
            onUpdateEnvironment={handleUpdateEnvironment}
            onUpdateCustomer={handleUpdateCustomer}
            onUpdateService={handleUpdateService}
            onUpdateModule={handleUpdateModule}
          />

          <ConfigurationPanel
            isGlobalLevel={isGlobalLevel}
            variables={isGlobalLevel ? filteredVariables : overriddenVariables}
            services={services}
            getCurrentValue={getCurrentValue}
            onAddVariable={() => setIsAddingVariable(true)}
            onImportJson={() => setIsImportingJson(true)}
            onAddOverride={() => setIsSelectingVariable(true)}
            onStartEditing={handleStartEditing}
            onEditVariable={handleEditVariable}
            onDeleteVariable={(variable) => {
              setVariableToDelete(variable);
              setIsDeletingVariable(true);
            }}
            onDeleteOverride={handleDeleteOverride}
            editingVariable={editingVariable}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            onUpdateValue={handleUpdateValue}
            onCancelEditing={() => {
              setIsEditingValue(false);
              setEditingVariable(null);
            }}
            effectiveConfiguration={effectiveConfiguration}
            selectedModule={selectedModule}
            selectedEnv={selectedEnv}
            selectedCustomer={selectedCustomer}
          />
        </div>

        <AddEnvironmentModal
          isOpen={isAddingEnvironment}
          onClose={() => setIsAddingEnvironment(false)}
          newEnvironment={newEnvironment}
          setNewEnvironment={setNewEnvironment}
          onAdd={handleAddEnvironment}
        />

        <AddCustomerModal
          isOpen={isAddingCustomer && !!selectedEnv}
          onClose={() => {
            setIsAddingCustomer(false);
            setNewCustomer({ name: '', domain: '' });
          }}
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          onAdd={handleAddCustomer}
        />

        <AddServiceModal
          isOpen={isAddingService}
          onClose={() => setIsAddingService(false)}
          newService={newService}
          setNewService={setNewService}
          onAdd={handleAddService}
        />

        <AddModuleModal
          isOpen={isAddingModule}
          onClose={() => {
            setIsAddingModule(false);
            setNewModule({ name: '', description: '' });
          }}
          newModule={newModule}
          setNewModule={setNewModule}
          onAdd={handleAddModule}
        />

        <AddVariableModal
          isOpen={isAddingVariable && isGlobalLevel}
          onClose={() => setIsAddingVariable(false)}
          services={services}
          modules={modules}
          newVariable={newVariable}
          setNewVariable={setNewVariable}
          onAdd={handleAddVariable}
        />

        <EditVariableModal
          isOpen={isEditingVariable}
          onClose={() => {
            setIsEditingVariable(false);
            setEditedVariable(null);
          }}
          variable={editedVariable}
          services={services}
          modules={modules}
          editedVariable={editedVariable}
          setEditedVariable={setEditedVariable}
          onSave={handleUpdateVariable}
        />

        <ImportJsonModal
          isOpen={isImportingJson}
          onClose={() => {
            setIsImportingJson(false);
            setJsonImport('');
            setJsonImportError(null);
          }}
          jsonImport={jsonImport}
          setJsonImport={setJsonImport}
          jsonImportError={jsonImportError}
          setJsonImportError={setJsonImportError}
          onImport={handleImportJson}
          services={services}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
        />

        <SelectVariableModal
          isOpen={isSelectingVariable && !isGlobalLevel}
          onClose={() => setIsSelectingVariable(false)}
          variables={getAvailableVariables()}
          onSelect={handleAddOverride}
          services={services}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
        />

        {variableToDelete && (
          <DeleteVariableModal
            isOpen={isDeletingVariable}
            onClose={() => {
              setIsDeletingVariable(false);
              setVariableToDelete(null);
            }}
            variable={variableToDelete}
            onDelete={handleDeleteVariable}
          />
        )}
      </div>
    </div>
  );
}

export default App;