import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type AuthContextProps = {
  apiKey: string | null;
  saveApiKey: (key: string) => void;
  resetAuth: () => void;
  subDomain : string | null;
  saveSubDomain: (key: string) => void;
};

const defaultValues: AuthContextProps = {
  apiKey: null,
  saveApiKey: () => null,
  resetAuth: () => null,
  subDomain : null,
  saveSubDomain: () => null,
};

const SUB_DOMAIN = 'SUB_DOMAIN';
const API_KEY = 'CMG_API_KEY';
const AuthContext = createContext<AuthContextProps>(defaultValues);

export const ApiKeyProvider: React.FC = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const [subDomain, setSubDomain] = useState<string | null>(null);
  const fetchApiKey = useCallback(() => {
    const apiKey = localStorage.getItem(API_KEY);
    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  const saveApiKey = useCallback((key: string) => {
    localStorage.setItem(API_KEY, key);
    setApiKey(key);
  }, []);

  const resetAuth = useCallback(() => {
    localStorage.clear();
    setApiKey(null);
  }, []);

  const fetchSubDomain = useCallback(() => {
    const subDomain = localStorage.getItem(SUB_DOMAIN);
    if (subDomain) {
      setSubDomain(subDomain);
    }
  }, []);
  const saveSubDomain = useCallback((subdomain: string) => {
    localStorage.setItem(SUB_DOMAIN, subdomain);
    setSubDomain(subdomain);
  }, []);
  useEffect(() => {
    fetchApiKey();
    fetchSubDomain();
  }, [fetchApiKey,fetchSubDomain]);

  return (
    <AuthContext.Provider value={{ apiKey, saveApiKey, resetAuth,subDomain,saveSubDomain }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);