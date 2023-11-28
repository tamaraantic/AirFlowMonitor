// ToastProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    setShowToast(() => toast.info("popiti")); // Postavljanje funkcije za prikazivanje toasta
  }, []);

  return (
    <>
      <ToastContext.Provider value={showToast}>
        {children}
      </ToastContext.Provider>
      <ToastContainer position="top-right" />
    </>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
