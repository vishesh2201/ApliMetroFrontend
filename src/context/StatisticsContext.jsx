import React, { createContext, useState, useEffect, useContext } from 'react';

const StatisticsContext = createContext(null);

export const StatisticsProvider = ({ children }) => {
    const [totalTrains, setTotalTrains] = useState(0);
    const [jobCardBacklog, setJobCardBacklog] = useState(0);
    const [severityBreakdown, setSeverityBreakdown] = useState({});
    const [odometers, setOdometers] = useState([]);
    const [loadingOdo, setLoadingOdo] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/total-trains/')
            .then(response => response.json())
            .then(data => setTotalTrains(data.total_trains))
            .catch(error => console.error('Error fetching total trains:', error));

        fetch('http://127.0.0.1:8000/api/jobcard-backlog/')
            .then(response => response.json())
            .then(data => {
                setJobCardBacklog(data.total_jobcards);
                setSeverityBreakdown(data.severity_breakdown);
            })
            .catch(error => console.error('Error fetching job card backlog:', error));

        fetch('http://127.0.0.1:8000/api/train-age-distribution/')
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
