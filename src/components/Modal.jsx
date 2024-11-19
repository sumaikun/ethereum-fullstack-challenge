import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-96 rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
                </div>
                <div className="mt-4">
                    {children}
                </div>
                <div className="mt-4 text-right">
                    <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
