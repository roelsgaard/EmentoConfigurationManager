import React from 'react';
import { X } from 'lucide-react';

export function AddEnvironmentModal({
    isOpen,
    onClose,
    newEnvironment,
    setNewEnvironment,
    onAdd
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Add Environment</h3>
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
                            Environment Name
                        </label>
                        <input
                            type="text"
                            value={newEnvironment}
                            onChange={(e) => setNewEnvironment(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="e.g., production"
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
                        onClick={onAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={!newEnvironment.trim()}
                    >
                        Add Environment
                    </button>
                </div>
            </div>
        </div>
    );
}