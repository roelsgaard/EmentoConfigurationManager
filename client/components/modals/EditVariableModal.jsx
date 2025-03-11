import React from 'react';
import { X } from 'lucide-react';

export function EditVariableModal({
    isOpen,
    onClose,
    variable,
    services,
    modules,
    editedVariable,
    setEditedVariable,
    onSave
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Edit Configuration Variable</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={editedVariable.service_id}
                            onChange={(e) => setEditedVariable({ ...editedVariable, service_id: e.target.value })}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Module
                        </label>
                        <select
                            value={editedVariable.module_id || ''}
                            onChange={(e) => setEditedVariable({
                                ...editedVariable,
                                module_id: e.target.value || null
                            })}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">No module (Global)</option>
                            {modules.map(module => (
                                <option key={module.id} value={module.id}>
                                    {module.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editedVariable.name}
                            onChange={(e) => setEditedVariable({ ...editedVariable, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="e.g., Theme Mode"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={editedVariable.type}
                            onChange={(e) => setEditedVariable({ ...editedVariable, type: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="object">Object</option>
                            <option value="array">Array</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Value <span className="text-red-500">*</span>
                        </label>
                        {editedVariable.type === 'boolean' ? (
                            <select
                                value={String(editedVariable.defaultValue)}
                                onChange={(e) => setEditedVariable({
                                    ...editedVariable,
                                    defaultValue: e.target.value === 'true'
                                })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="true">Enabled</option>
                                <option value="false">Disabled</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={editedVariable.defaultValue}
                                onChange={(e) => setEditedVariable({ ...editedVariable, defaultValue: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder={editedVariable.type === 'array' ? '["item1", "item2"]' : 'e.g., light'}
                                required
                            />
                        )}
                        {editedVariable.type === 'array' && (
                            <p className="mt-1 text-sm text-gray-500">
                                Enter array items in JSON format: ["item1", "item2"]
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            JSON Path <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editedVariable.jsonPath}
                            onChange={(e) => setEditedVariable({ ...editedVariable, jsonPath: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="e.g., theme.mode"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={editedVariable.description}
                            onChange={(e) => setEditedVariable({ ...editedVariable, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={3}
                            placeholder="Describe the purpose of this configuration variable"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSave();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={!editedVariable.name.trim() || !editedVariable.service_id || !editedVariable.jsonPath.trim()}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}