import React, { createContext, useState, useEffect, useContext } from 'react';

const StatisticsContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const StatisticsProvider = ({ children }) => {
    const [totalTrains, setTotalTrains] = useState(0);
    const [jobCardBacklog, setJobCardBacklog] = useState(0);
    const [severityBreakdown, setSeverityBreakdown] = useState({});
    const [odometers, setOdometers] = useState([]);
    const [loadingOdo, setLoadingOdo] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/total-trains/`)
            .then(response => response.json())
            .then(data => setTotalTrains(data.total_trains))
            .catch(error => console.error('Error fetching total trains:', error));

        fetch(`${API_URL}/api/jobcard-backlog/`)
            .then(response => response.json())
            .then(data => {
                setJobCardBacklog(data.total_jobcards);
                setSeverityBreakdown(data.severity_breakdown);
            })
            .catch(error => console.error('Error fetching job card backlog:', error));

        fetch(`${API_URL}/api/train-age-distribution/`)
            .then(res => res.json())
            .then(data => {
                setOdometers(data.odometers || []);
                setLoadingOdo(false);
            })
            .catch(() => setLoadingOdo(false));
    }, []);

    return (
        <StatisticsContext.Provider value={{ totalTrains, jobCardBacklog, severityBreakdown, odometers, loadingOdo }}>
            {children}
        </StatisticsContext.Provider>
    );
};

export const useStatistics = () => {
    return useContext(StatisticsContext);
};
