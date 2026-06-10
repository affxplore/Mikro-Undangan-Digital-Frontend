import React from 'react';

const Button = ({ children, className = '', onClick, ...props }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded px-4 py-2 text-sm font-medium ${className}`}
    {...props}
  >
    {children}
  </button>
);

const CloseConfirmationModal = ({ isOpen, onClose, onSave, onCloseWithoutSaving }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle relative">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Warning icon */}
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Tutup Editor
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Anda memiliki perubahan yang belum disimpan. Apa yang ingin Anda lakukan?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              onClick={onSave}
              className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
            >
              Save & Close
            </Button>
            <Button
              onClick={onCloseWithoutSaving}
              className="mt-3 w-full justify-center border border-red-300 bg-white text-red-700 hover:bg-red-50 sm:mt-0 sm:ml-3 sm:w-auto"
            >
              Close without Saving
            </Button>
            <Button
              onClick={onClose}
              className="mt-3 w-full justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloseConfirmationModal;