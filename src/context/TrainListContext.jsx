import React, { createContext, useContext, useEffect, useState } from 'react';

const TrainListContext = createContext();

export function TrainListProvider({ children }) {
    const [trainList, setTrainList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://127.0.0.1:8000/api/trains/')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch train list');
                return res.json();
            })
            .then((data) => {
                // Transform API data to match frontend expectations (latest structure)
                const priorities = ['None', 'Low', 'Medium', 'High', 'Critical'];
                const transformed = data.map(train => {
                    // Calculate severity if not present
                    let severity = 'None';
                    if (train.jobCards && Array.isArray(train.jobCards.all) && train.jobCards.all.length > 0) {
                        severity = train.jobCards.all.reduce((max, jc) => {
                            return priorities.indexOf(jc.priority) > priorities.indexOf(max) ? jc.priority : max;
                        }, 'None');
                    }
                    return {
                        id: train.id,
                        fitness: train.certificates,
                        mileage: train.mileage,
                        branding: train.branding,
                        cleaningSlot: train.cleaningSlot,
                        stablingBay: train.stablingBay,
                        crew: train.crew,
                        override: train.override,
                        jobCards: {
                            ...train.jobCards,
                            severity,
                        },
                    };
                });
                setTrainList(transformed);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return (
        <TrainListContext.Provider value={{ trainList, setTrainList, loading, error }}>
            {children}
        </TrainListContext.Provider>
    );
}

export function useTrainList() {
    return useContext(TrainListContext);
}
