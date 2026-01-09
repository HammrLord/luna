import React, { createContext, useState, useContext } from 'react';

type SentinelMode = 'idle' | 'analyzing' | 'stressed';

interface UserContextType {
    userName: string;
    setUserName: (name: string) => void;
    sentinelMode: SentinelMode;
    setSentinelMode: (mode: SentinelMode) => void;
    toggleStressMode: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userName, setUserName] = useState('Namja');
    const [sentinelMode, setSentinelMode] = useState<SentinelMode>('idle');

    const toggleStressMode = () => {
        setSentinelMode(prev => prev === 'idle' ? 'stressed' : 'idle');
    };

    return (
        <UserContext.Provider value={{ userName, setUserName, sentinelMode, setSentinelMode, toggleStressMode }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
