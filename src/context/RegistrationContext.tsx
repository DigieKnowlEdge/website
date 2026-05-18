"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface RegistrationContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const RegistrationContext = createContext<RegistrationContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <RegistrationContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  return useContext(RegistrationContext);
}
