import React, { createContext, useState, useEffect } from 'react';

export const LabStatusContext = createContext(null);

export const LabStatusProvider = ({ children }) => {
  const [isLabOpen, setIsLabOpen] = useState(() => {
    const saved = localStorage.getItem('labStatus');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('labStatus', JSON.stringify(isLabOpen));
  }, [isLabOpen]);

  const toggleLabStatus = () => setIsLabOpen((prev) => !prev);

  return (
    <LabStatusContext.Provider value={{ isLabOpen, toggleLabStatus }}>
      {children}
    </LabStatusContext.Provider>
  );
};