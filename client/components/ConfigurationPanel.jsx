import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Search, Check, X, Edit2, Settings, AlertTriangle, EyeOff, Eye } from 'lucide-react';
import { JsonViewer } from '@textea/json-viewer';
import { dataService } from '../lib/api';

export function ConfigurationPanel({
    isGlobalLevel,
    variables,
    services,
    getCurrentValue,
    onAddVariable,
    onImportJson,
    onAddOverride,
    onStartEditing,
    onEditVariable,
    onDeleteVariable,
    onDeleteOverride,
    editingVariable,
    editingValue,
    setEditingValue,
    onUpdateValue,
    onCancelEditing,
    effectiveConfiguration,
    selectedModule,
    selectedEnv,
    selectedCustomer
}) {
    const [search, setSearch] = useState('');
    const [hiddenVariables, setHiddenVariables] = useState([]);

    // Fetch hidden variables on mount and when selection changes
    useEffect(() => {
        const fetchHiddenVariables = async () => {
            try {
                const hidden = await dataService.getHiddenVariables();
                setHiddenVariables(hidden);
            } catch (error) {
                console.error('Error fetching hidden variables:', error);
            }
        };
        fetchHiddenVariables();
    }, [selectedEnv, selectedCustomer]);

    const filteredVariables = variables.filter(variable =>
        (!selectedModule || variable.module_id === selectedModule) &&
        (variable.name.toLowerCase().includes(search.toLowerCase()) ||
            variable.description?.toLowerCase().includes(search.toLowerCase()) ||
            variable.jsonPath.toLowerCase().includes(search.toLowerCase()))
    );

    const getFullPath = (variable) => {
        const service = services.find(s => s.id === variable.service_id);
        return service ? `${service.root_path}.${variable.jsonPath}` : variable.jsonPath;
    };

    const isVariableHidden = (variableId) => {
        return hiddenVariables.some(h =>
            h.variable_id === variableId &&
            h.level === (selectedCustomer ? 'customer' : 'environment') &&
            h.entity_id === (selectedCustomer || selectedEnv)
        );
    };

    const formatValue = (value, type) => {
        if (type === 'boolean') {
            return value ? (
                <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="ml-2 text-green-600">Enabled</span>
                </div>
            ) : (
                <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="ml-2 text-red-600">Disabled</span>
                </div>
            );
        }

        if (type === 'array') {
            try {
                const arrayValue = Array.isArray(value) ? value : JSON.parse(value);
                return (
                    <div className="flex flex-wrap gap-2">
                        {arrayValue.map((item, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                );
            } catch (error) {
                return String(value);
            }
        }
        return String(value);
    };

    const toggleVariableVisibility = async (variable) => {
        try {
            const level = selectedCustomer ? 'customer' : 'environment';
            const entityId = selectedCustomer || selectedEnv;
            const isHidden = isVariableHidden(variable.id);

            await dataService.setVariableHidden(
                variable.id,
                level,
                entityId,
                !isHidden
            );

            // Fetch updated hidden variables
            const updated = await dataService.getHiddenVariables();
            setHiddenVariables(updated);

            // Trigger a refetch of the effective configuration
            if (typeof onUpdateValue === 'function') {
                onUpdateValue(variable);
            }
        } catch (error) {
            console.error('Error toggling variable visibility:', error);
        }
    };

    return (
        <div className="md:col-span-9 space-y-6">
            {/* Variables Section */}
            <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">
                        {isGlobalLevel ? 'Global Configuration Variables' : 'Configuration Overrides'}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={onImportJson}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Import JSON
                        </button>
                        {isGlobalLevel ? (
                            <button
                                onClick={onAddVariable}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Variable
                            </button>
                        ) : (
                            <button
                                onClick={onAddOverride}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Override
                            </button>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${isGlobalLevel ? 'variables' : 'overrides'}...`}
                            className="w-full pl-9 pr-3 py-2 border rounded-lg"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredVariables.map(variable => (
                        <div key={variable.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-semibold">{variable.name}</h3>
                                    <p className="text-sm text-gray-600">{variable.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                        {variable.type}
                                    </span>
                                    {!isGlobalLevel && (
                                        <button
                                            onClick={() => toggleVariableVisibility(variable)}
                                            className={`p-1 ${isVariableHidden(variable.id)
                                                    ? 'text-gray-400 hover:text-gray-600'
                                                    : 'text-gray-600 hover:text-gray-800'
                                                }`}
                                            title={isVariableHidden(variable.id) ? "Show variable" : "Hide variable"}
                                        >
                                            {isVariableHidden(variable.id) ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    )}
                                    {isGlobalLevel && (
                                        <button
                                            onClick={() => onEditVariable(variable)}
                                            className="p-1 text-gray-500 hover:text-blue-600"
                                            title="Edit variable settings"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    )}
                                    {isGlobalLevel ? (
                                        <button
                                            onClick={() => onDeleteVariable(variable)}
                                            className="p-1 text-gray-500 hover:text-red-600"
                                            title="Delete variable"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onDeleteOverride(variable)}
                                            className="p-1 text-gray-500 hover:text-red-600"
                                            title="Delete override"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Path: <code className="bg-gray-100 px-2 py-1 rounded">{getFullPath(variable)}</code>
                                </p>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {isGlobalLevel ? 'Default Value' : 'Override Value'}
                                        </label>
                                        {editingVariable?.id === variable.id ? (
                                            <div className="flex gap-2">
                                                {variable.type === 'boolean' ? (
                                                    <select
                                                        value={editingValue}
                                                        onChange={(e) => setEditingValue(e.target.value)}
                                                        className="flex-1 px-3 py-2 border rounded-lg"
                                                    >
                                                        <option value="true">Enabled</option>
                                                        <option value="false">Disabled</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={editingValue}
                                                        onChange={(e) => setEditingValue(e.target.value)}
                                                        className="flex-1 px-3 py-2 border rounded-lg"
                                                        placeholder={variable.type === 'array' ? '["item1", "item2"]' : undefined}
                                                    />
                                                )}
                                                <button
                                                    onClick={() => onUpdateValue(variable)}
                                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={onCancelEditing}
                                                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 items-center">
                                                <div className="flex-1 bg-gray-100 px-3 py-2 rounded-lg overflow-x-auto">
                                                    {formatValue(getCurrentValue(variable), variable.type)}
                                                </div>
                                                <button
                                                    onClick={() => onStartEditing(variable)}
                                                    className={`px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2
                            ${isGlobalLevel ? 'hidden' : ''}`}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    {'Edit Override'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredVariables.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {search ? (
                                'No variables match your search'
                            ) : !isGlobalLevel ? (
                                'No overrides configured. Click "Add Override" to start customizing values.'
                            ) : (
                                'No variables found. Click "Add Variable" to create your first configuration variable.'
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Effective Configuration */}
            <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Effective Configuration</h2>
                    {effectiveConfiguration._validation && !effectiveConfiguration._validation.isValid && (
                        <div className="flex items-center gap-2 text-amber-600">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Configuration is incomplete</span>
                        </div>
                    )}
                </div>

                {effectiveConfiguration._validation && !effectiveConfiguration._validation.isValid && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Missing Required Variables</h3>
                        <p className="text-amber-700 mb-4">
                            The following variables need to be configured or hidden:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            {effectiveConfiguration._validation.missingVariables.map(variable => (
                                <li key={variable.id} className="text-amber-700">
                                    <span className="font-medium">{variable.name}</span>
                                    <span className="text-amber-600"> in </span>
                                    <span className="font-medium">{variable.service}</span>
                                    <code className="ml-2 px-2 py-1 bg-amber-100 rounded text-amber-800">
                                        {variable.jsonPath}
                                    </code>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bg-gray-100 p-4 rounded">
                    <JsonViewer
                        value={effectiveConfiguration}
                        defaultInspectDepth={2}
                        theme="light"
                    />
                </div>
            </div>
        </div>
    );
}