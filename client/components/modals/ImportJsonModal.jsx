import React from 'react';
import { X } from 'lucide-react';

export function ImportJsonModal({
  isOpen,
  onClose,
  jsonImport,
  setJsonImport,
  jsonImportError,
  setJsonImportError,
  onImport,
  services,
  selectedService,
  onServiceSelect
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setJsonImport('');
    setJsonImportError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Import Configuration from JSON</h3>
          <button
            onClick={handleClose}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              JSON Configuration
            </label>
            <textarea
              value={jsonImport}
              onChange={(e) => {
                setJsonImport(e.target.value);
                setJsonImportError(null);
              }}
              className="w-full px-3 py-2 border rounded-lg font-mono"
              rows={10}
              placeholder=""
            />
            {jsonImportError && (
              <p className="mt-2 text-sm text-red-600">{jsonImportError}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onImport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!jsonImport.trim() || !selectedService}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}