import React, { createContext, useContext, useState } from 'react';

const InductionListContext = createContext();

export function InductionListProvider({ children }) {
    const [inductionList, setInductionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <InductionListContext.Provider value={{ inductionList, setInductionList, loading, setLoading, error }}>
            {children}
        </InductionListContext.Provider>
    );
}

export function useInductionList() {
    return useContext(InductionListContext);
}
