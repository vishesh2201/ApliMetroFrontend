
import React from 'react';
import { mockTrains } from '../data/mockData';
import { useStatistics } from '../context/StatisticsContext';

import FleetUtilizationChart from './FleetUtilizationChart';
import JobCardSeverityChart from './JobCardSeverityChart';
import TrainAgeDistributionChart from './TrainAgeDistributionChart';
import DepotDistributionChart from './DepotDistributionChart';
import JobCardsResolvedChart from './JobCardsResolvedChart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- KPI Calculations ---
const fitToRun = mockTrains.filter(
    t => Object.values(t.fitness).every(val => val === 'OK') && !t.jobCards.all.some(jc => jc.priority === 'Critical' || jc.priority === 'High')
).length;
const underMaintenance = mockTrains.filter(
    t => Object.values(t.fitness).includes('Expired') || t.jobCards.all.some(jc => jc.priority === 'Critical' || jc.priority === 'High')
).length;


// --- Color Palette ---
const BAR_COLORS = {
    jobCard: '#4285F4', // blue
    trainAge: '#00C220', // green
    depot: '#FF9146', // orange
};

// --- Fleet Utilization Data (Pie) ---
const fleetUtilizationData = {
    labels: ['Fit to Run', 'Under Maintenance', 'Other'],
    datasets: [
        {
            data: [fitToRun, underMaintenance, mockTrains.length - fitToRun - underMaintenance],
            backgroundColor: ['#4285F4', '#00C220', '#FF9146'],
        },
    ],
};


// --- Job Card Severity Data (Bar) ---
const severityLevels = ['Critical', 'High', 'Medium', 'Low', 'None'];
const jobCardSeverityCounts = severityLevels.map(sev =>
    mockTrains.reduce((sum, t) => sum + t.jobCards.all.filter(jc => jc.priority === sev).length, 0)
);
const jobCardSeverityData = {
    labels: severityLevels,
    datasets: [
        {
            label: 'Job Cards',
            data: jobCardSeverityCounts,
            backgroundColor: BAR_COLORS.jobCard,
        },
    ],
};


// --- Train Age Distribution (Bar, using odometer as proxy for age, now from API) ---
const ageBuckets = [
    { range: '<130k', min: 0, max: 130000 },
    { range: '130k-135k', min: 130000, max: 135000 },
    { range: '135k-140k', min: 135000, max: 140000 },
    { range: '140k-145k', min: 140000, max: 145000 },
    { range: '145k-150k', min: 145000, max: 150000 },
    { range: '150k+', min: 150000, max: Infinity },
];

function getTrainAgeData(odometers) {
    const counts = ageBuckets.map(bucket =>
        odometers.filter(odo => odo >= bucket.min && odo < bucket.max).length
    );
    return {
        labels: ageBuckets.map(b => b.range),
        datasets: [
            {
                label: 'Trains',
                data: counts,
                backgroundColor: BAR_COLORS.trainAge,
            },
        ],
    };
}


// --- Depot/Line Distribution (Bar, 4 bays, random distribution of 25 trains) ---
const depotLabels = ['Bay 1', 'Bay 2', 'Bay 3', 'Bay 4'];
function getRandomDepotCounts(totalTrains, numBays) {
    // Start with 0 in each bay
    const counts = Array(numBays).fill(0);
    for (let i = 0; i < totalTrains; i++) {
        const bay = Math.floor(Math.random() * numBays);
        counts[bay]++;
    }
    return counts;
}
const depotCounts = getRandomDepotCounts(25, 4);
const depotData = {
    labels: depotLabels,
    datasets: [
        {
            label: 'Trains',
            data: depotCounts,
            backgroundColor: BAR_COLORS.depot,
        },
    ],
};


const Statistics = () => {
    const { totalTrains, jobCardBacklog, severityBreakdown, odometers, loadingOdo } = useStatistics();
    const trainAgeData = getTrainAgeData(odometers);

    // Mock data for job cards raised/resolved
    const jobCardsRaised = mockTrains.reduce((sum, t) => sum + (t.jobCards?.all?.length || 0), 0);
    const jobCardsResolved = mockTrains.reduce((sum, t) => sum + (t.jobCards?.resolved?.length || 0), 0);

    return (
        <div className="p-4 bg-gray-50">
            <h1 className="font-bold mb-4 text-[#4285F4]" style={{ fontSize: '2rem' }}>Statistics</h1>

            {/* KPIs - Continuous horizontal strip with vertical separators */}
            <div className="flex mb-8 bg-[#F2F9FF] rounded-2xl shadow-lg overflow-hidden divide-x divide-gray-200">
                {/* Trains Fit to Run */}
                <div className="flex-1 p-4 py-10 flex mt-2">
                    <div className="text-lg font-semibold text-left" style={{ color: '#6689FF' }}>
                        Trains Fit<br />to Run
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold" style={{ color: '#000000' }}>
                            16
                        </div>
                        <div className="pt-4 text-sm font-normal" style={{ color: '#A3A7AF' }}>
                            compared to yesterday: <span style={{ color: '#49AF4E', fontWeight: 600 }}>2<span style={{ color: '#49AF4E' }}>+</span></span>
                        </div>
                    </div>
                </div>

                {/* Total Trains */}
                <div className="flex-1 p-4 py-10 flex mt-2">
                    <div className="text-lg font-semibold text-left" style={{ color: '#6689FF' }}>
                        Total<br />Trains
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="text-5xl font-bold" style={{ color: '#000000' }}>
                            {totalTrains}
                        </div>
                    </div>
                </div>

                {/* Trains Under Maintenance */}
                <div className="flex-1 p-4 py-10 flex mt-2">
                    <div className="text-lg font-semibold text-left" style={{ color: '#6689FF' }}>
                        Trains Under<br />Maintenance
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold" style={{ color: '#000000' }}>
                            {/* You may want to update this to use real data as well */}
                            9
                        </div>
                        <div className="pt-4 text-sm font-normal whitespace-nowrap" style={{ color: '#A3A7AF' }}>
                            compared to yesterday:{" "}
                            <span style={{ color: '#49AF4E', fontWeight: 600 }}>
                                2<span style={{ color: '#49AF4E' }}>-</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Job Card Backlog */}
                <div className="flex-1 p-4 py-10 flex relative mt-2">
                    <div className="text-lg font-semibold text-left" style={{ color: '#6689FF' }}>
                        Job Card<br />Backlog
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="text-5xl font-bold" style={{ color: '#000000' }}>
                            {jobCardBacklog}
                        </div>
                        <div className="absolute bottom-9 left-0 right-0 flex justify-center space-x-2 px-2">
                            {Object.entries(severityBreakdown).map(([severity, count]) => {
                                // Define badge background and text color (full opacity for text)
                                const badgeBgColors = {
                                    Critical: '#FF4D4D52',
                                    High: '#FF914652',
                                    Medium: '#FFC10752',
                                    Low: '#4CAF5052',
                                };
                                const badgeTextColors = {
                                    Critical: '#FF4D4D',
                                    High: '#FF9146',
                                    Medium: '#FFC107',
                                    Low: '#4CAF50',
                                };
                                return (
                                    <span
                                        key={severity}
                                        className="px-2 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: badgeBgColors[severity],
                                            color: badgeTextColors[severity],
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {severity}: {count}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded shadow p-4">
                    <FleetUtilizationChart data={fleetUtilizationData} />
                </div>
                <div className="bg-white rounded shadow p-4">
                    <JobCardSeverityChart data={jobCardSeverityData} />
                </div>
                <div className="bg-white rounded shadow p-4">
                    <JobCardsResolvedChart data={{ raised: jobCardsRaised, resolved: jobCardsResolved }} />
                </div>
                <div className="bg-white rounded shadow p-4">
                    {loadingOdo ? (
                        <div className="text-center text-gray-400">Loading train age distribution...</div>
                    ) : (
                        <TrainAgeDistributionChart data={trainAgeData} />
                    )}
                </div>
                <div className="bg-white rounded shadow p-4">
                    <DepotDistributionChart data={depotData} />
                </div>
            </div>

            {/* Induction Trends and Cumulative Progress - Placeholder */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Induction Trends (Mock Data)</h2>
                <div className="text-gray-400">Line chart of trains inducted per month/week can be added here.</div>
            </div>
        </div>
    );
};

export default Statistics;
