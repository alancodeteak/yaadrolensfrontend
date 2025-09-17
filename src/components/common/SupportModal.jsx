import React from 'react';
import { X } from 'lucide-react';

const SupportModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Support</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            For password reset and support, please contact:
          </p>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-medium">Email: support@yaadro.com</p>
            <p className="font-medium">Phone: +1 (555) 123-4567</p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
