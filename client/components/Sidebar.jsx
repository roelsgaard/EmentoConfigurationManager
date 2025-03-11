import React, { useState } from 'react';
import { Globe, Building2, Users, Plus, Search, Trash2, Boxes, Edit2, Layers } from 'lucide-react';
import { EditEnvironmentModal } from './modals/EditEnvironmentModal';
import { EditCustomerModal } from './modals/EditCustomerModal';
import { EditServiceModal } from './modals/EditServiceModal';
import { EditModuleModal } from './modals/EditModuleModal';

export function Sidebar({
    environments,
    customers,
    services,
    modules,
    selectedEnv,
    selectedCustomer,
    selectedService,
    selectedModule,
    environmentSearch,
    customerSearch,
    serviceSearch,
    moduleSearch,
    onEnvironmentSearchChange,
    onCustomerSearchChange,
    onServiceSearchChange,
    onModuleSearchChange,
    onEnvironmentSelect,
    onCustomerSelect,
    onServiceSelect,
    onModuleSelect,
    onAddEnvironment,
    onAddCustomer,
    onAddService,
    onAddModule,
    onDeleteEnvironment,
    onDeleteCustomer,
    onDeleteService,
    onDeleteModule,
    onUpdateEnvironment,
    onUpdateCustomer,
    onUpdateService,
    onUpdateModule
}) {
    const [editingEnvironment, setEditingEnvironment] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editedCustomer, setEditedCustomer] = useState({ name: '', domain: '' });
    const [editingService, setEditingService] = useState(null);
    const [editedService, setEditedService] = useState({ name: '', root_path: '' });
    const [editingModule, setEditingModule] = useState(null);
    const [editedModule, setEditedModule] = useState({ name: '', description: '' });

    const filteredEnvironments = environments.filter(env =>
        env.name.toLowerCase().includes(environmentSearch.toLowerCase())
    );

    const filteredCustomers = customers.filter(customer =>
        customer.environment_id === selectedEnv &&
        (customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            customer.domain.toLowerCase().includes(customerSearch.toLowerCase()))
    );

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        service.root_path.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    const filteredModules = modules.filter(module =>
        module.name.toLowerCase().includes(moduleSearch.toLowerCase())
    );

    const handleCustomerClick = (customerId) => {
        if (customerId) {
            const customer = customers.find(c => c.id === customerId);
            if (customer) {
                onEnvironmentSelect(customer.environment_id);
                onCustomerSelect(customerId);
            }
        } else {
            onCustomerSelect(null);
        }
    };

    const handleServiceClick = (serviceId) => {
        if (selectedService === serviceId) {
            onServiceSelect(null);
        } else {
            onServiceSelect(serviceId);
        }
    };

    const handleModuleClick = (moduleId) => {
        if (selectedModule === moduleId) {
            onModuleSelect(null);
        } else {
            onModuleSelect(moduleId);
        }
    };

    const handleEditEnvironment = (environment) => {
        setEditingEnvironment(environment);
        setEditedName(environment.name);
    };

    const handleSaveEnvironment = async () => {
        await onUpdateEnvironment(editingEnvironment.id, { name: editedName });
        setEditingEnvironment(null);
        setEditedName('');
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setEditedCustomer({
            name: customer.name,
            domain: customer.domain
        });
    };

    const handleSaveCustomer = async () => {
        await onUpdateCustomer(editingCustomer.id, editedCustomer);
        setEditingCustomer(null);
        setEditedCustomer({ name: '', domain: '' });
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setEditedService({
            name: service.name,
            root_path: service.root_path
        });
    };

    const handleSaveService = async () => {
        await onUpdateService(editingService.id, editedService);
        setEditingService(null);
        setEditedService({ name: '', root_path: '' });
    };

    const handleEditModule = (module) => {
        setEditingModule(module);
        setEditedModule({
            name: module.name,
            description: module.description || ''
        });
    };

    const handleSaveModule = async () => {
        await onUpdateModule(editingModule.id, editedModule);
        setEditingModule(null);
        setEditedModule({ name: '', description: '' });
    };

    return (
        <div className="md:col-span-3 space-y-6">
            {/* Global Section */}
            <div className="bg-white rounded-lg p-4 shadow">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Global
                </h2>
                <button
                    onClick={() => {
                        onCustomerSelect(null);
                        onEnvironmentSelect(null);
                        onServiceSelect(null);
                        onModuleSelect(null);
                    }}
                    className={`w-full px-4 py-2 rounded ${!selectedEnv && !selectedCustomer && !selectedService && !selectedModule
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                >
                    View Global Config
                </button>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Boxes className="w-5 h-5" />
                        Services
                    </h2>
                    <button
                        onClick={onAddService}
                        className="p-1 text-gray-600 hover:text-gray-900"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={serviceSearch}
                            onChange={(e) => onServiceSearchChange(e.target.value)}
                            placeholder="Search services..."
                            className="w-full pl-9 pr-3 py-2 border rounded-lg"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredServices.map(service => (
                        <div key={service.id} className="flex items-center gap-2">
                            <button
                                onClick={() => handleServiceClick(service.id)}
                                className={`flex-1 px-4 py-2 rounded text-left ${selectedService === service.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {service.name}
                            </button>
                            <button
                                onClick={() => handleEditService(service)}
                                className="p-2 text-gray-500 hover:text-blue-600 rounded"
                                title="Edit service"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDeleteService(service.id)}
                                className="p-2 text-gray-500 hover:text-red-600 rounded"
                                title="Delete service"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {filteredServices.length === 0 && (
                        <p className="text-center text-gray-500 py-2">
                            No services found
                        </p>
                    )}
                </div>

                {/* Modules Section (nested under Services) */}
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Layers className="w-5 h-5" />
                            Modules
                        </h3>
                        <button
                            onClick={onAddModule}
                            className="p-1 text-gray-600 hover:text-gray-900"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={moduleSearch}
                                onChange={(e) => onModuleSearchChange(e.target.value)}
                                placeholder="Search modules..."
                                className="w-full pl-9 pr-3 py-2 border rounded-lg"
                            />
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        {filteredModules.map(module => (
                            <div key={module.id} className="flex items-center gap-2">
                                <button
                                    onClick={() => handleModuleClick(module.id)}
                                    className={`flex-1 px-4 py-2 rounded text-left ${selectedModule === module.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    {module.name}
                                </button>
                                <button
                                    onClick={() => handleEditModule(module)}
                                    className="p-2 text-gray-500 hover:text-blue-600 rounded"
                                    title="Edit module"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDeleteModule(module.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 rounded"
                                    title="Delete module"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {filteredModules.length === 0 && (
                            <p className="text-center text-gray-500 py-2">
                                No modules found
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Environments Section */}
            <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Environments
                    </h2>
                    <button
                        onClick={onAddEnvironment}
                        className="p-1 text-gray-600 hover:text-gray-900"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={environmentSearch}
                            onChange={(e) => onEnvironmentSearchChange(e.target.value)}
                            placeholder="Search environments..."
                            className="w-full pl-9 pr-3 py-2 border rounded-lg"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredEnvironments.map(env => (
                        <div key={env.id} className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    onCustomerSelect(null);
                                    onEnvironmentSelect(env.id);
                                }}
                                className={`flex-1 px-4 py-2 rounded text-left ${selectedEnv === env.id
                                        ? selectedCustomer
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-blue-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {env.name}
                            </button>
                            <button
                                onClick={() => handleEditEnvironment(env)}
                                className="p-2 text-gray-500 hover:text-blue-600 rounded"
                                title="Edit environment"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDeleteEnvironment(env.id)}
                                className="p-2 text-gray-500 hover:text-red-600 rounded"
                                title="Delete environment"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {filteredEnvironments.length === 0 && (
                        <p className="text-center text-gray-500 py-2">
                            No environments found
                        </p>
                    )}
                </div>
            </div>

            {/* Customers Section */}
            <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Customers
                    </h2>
                    {selectedEnv && (
                        <button
                            onClick={onAddCustomer}
                            className="p-1 text-gray-600 hover:text-gray-900"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={customerSearch}
                            onChange={(e) => onCustomerSearchChange(e.target.value)}
                            placeholder="Search customers..."
                            className="w-full pl-9 pr-3 py-2 border rounded-lg"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className="flex items-center gap-2">
                            <button
                                onClick={() => handleCustomerClick(customer.id)}
                                className={`flex-1 px-4 py-2 rounded text-left ${selectedCustomer === customer.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {customer.name}
                            </button>
                            <button
                                onClick={() => handleEditCustomer(customer)}
                                className="p-2 text-gray-500 hover:text-blue-600 rounded"
                                title="Edit customer"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDeleteCustomer(customer.id)}
                                className="p-2 text-gray-500 hover:text-red-600 rounded"
                                title="Delete customer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {filteredCustomers.length === 0 && (
                        <p className="text-center text-gray-500 py-2">
                            {selectedEnv
                                ? 'No customers found in this environment'
                                : 'Select an environment to view customers'}
                        </p>
                    )}
                </div>
            </div>

            <EditEnvironmentModal
                isOpen={!!editingEnvironment}
                onClose={() => {
                    setEditingEnvironment(null);
                    setEditedName('');
                }}
                environment={editingEnvironment}
                editedName={editedName}
                setEditedName={setEditedName}
                onSave={handleSaveEnvironment}
            />

            <EditCustomerModal
                isOpen={!!editingCustomer}
                onClose={() => {
                    setEditingCustomer(null);
                    setEditedCustomer({ name: '', domain: '' });
                }}
                customer={editingCustomer}
                editedCustomer={editedCustomer}
                setEditedCustomer={setEditedCustomer}
                onSave={handleSaveCustomer}
            />

            <EditServiceModal
                isOpen={!!editingService}
                onClose={() => {
                    setEditingService(null);
                    setEditedService({ name: '', root_path: '' });
                }}
                service={editingService}
                editedService={editedService}
                setEditedService={setEditedService}
                onSave={handleSaveService}
            />

            <EditModuleModal
                isOpen={!!editingModule}
                onClose={() => {
                    setEditingModule(null);
                    setEditedModule({ name: '', description: '' });
                }}
                module={editingModule}
                editedModule={editedModule}
                setEditedModule={setEditedModule}
                onSave={handleSaveModule}
            />
        </div>
    );
}