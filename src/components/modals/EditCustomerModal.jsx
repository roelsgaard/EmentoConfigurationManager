import React from 'react';
import { X } from 'lucide-react';

export function EditCustomerModal({
  isOpen,
  onClose,
  customer,
  editedCustomer,
  setEditedCustomer,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Customer</h3>
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
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedCustomer.name}
              onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., customer-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedCustomer.domain}
              onChange={(e) => setEditedCustomer({ ...editedCustomer, domain: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., customer1.example.com"
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
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={
              !editedCustomer.name.trim() || 
              !editedCustomer.domain.trim() || 
              (editedCustomer.name === customer.name && editedCustomer.domain === customer.domain)
            }
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}