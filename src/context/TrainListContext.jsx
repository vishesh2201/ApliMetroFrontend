import React, { createContext, useContext, useEffect, useState } from 'react';

const TrainListContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function TrainListProvider({ children }) {
    const [trainList, setTrainList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/trains/`)
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
                        depotId: train.depotId || "Muttom", // Assuming a default depotId if not present
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
