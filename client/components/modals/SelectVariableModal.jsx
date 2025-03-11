import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

export function SelectVariableModal({
    isOpen,
    onClose,
    variables,
    onSelect,
    services,
    selectedService,
    onServiceSelect
}) {
    const [search, setSearch] = useState('');

    if (!isOpen) return null;

    const filteredVariables = variables.filter(variable =>
        (!selectedService || variable.service_id === selectedService) &&
        (variable.name.toLowerCase().includes(search.toLowerCase()) ||
            variable.description?.toLowerCase().includes(search.toLowerCase()) ||
            variable.jsonPath.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Add Override</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedService || ''}
                            onChange={(e) => onServiceSelect(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Select a service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search variables..."
                            className="w-full pl-9 pr-3 py-2 border rounded-lg"
                            disabled={!selectedService}
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0">
                    {!selectedService ? (
                        <div className="text-center py-8 text-gray-500">
                            Please select a service to view available variables
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredVariables.map(variable => (
                                <div key={variable.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-semibold">{variable.name}</h4>
                                            <p className="text-sm text-gray-600">{variable.description}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Path: <code className="bg-gray-100 px-2 py-1 rounded">{variable.jsonPath}</code>
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Type: <span className="bg-gray-100 px-2 py-1 rounded">{variable.type}</span>
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Default: <code className="bg-gray-100 px-2 py-1 rounded">{JSON.stringify(variable.defaultValue)}</code>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onSelect(variable.id)}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Add Override
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredVariables.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    {search ? 'No variables match your search' : 'All variables have been overridden'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}