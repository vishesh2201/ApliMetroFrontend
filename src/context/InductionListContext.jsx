import React, { createContext, useContext, useEffect, useState } from 'react';

const InductionListContext = createContext();

export function InductionListProvider({ children }) {
    const [inductionList, setInductionList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://127.0.0.1:8000/api/induction/')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch induction list');
                return res.json();
            })
            .then((data) => {
                setInductionList(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return (
        <InductionListContext.Provider value={{ inductionList, setInductionList, loading, setLoading, error }}>
            {children}
        </InductionListContext.Provider>
    );
}

export function useInductionList() {
    return useContext(InductionListContext);
}
