import React from 'react';
import { X } from 'lucide-react';

export function DeleteVariableModal({
  isOpen,
  onClose,
  variable,
  onDelete
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items- center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Delete Variable</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the variable "{variable.name}"? This action cannot be undone.
          </p>
          <p className="text-sm text-gray-500">
            All associated overrides will also be deleted.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Variable
          </button>
        </div>
      </div>
    </div>
  );
}