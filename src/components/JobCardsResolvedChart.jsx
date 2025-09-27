import React from 'react';
import { Bar } from 'react-chartjs-2';


const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function getRandomCounts(numMonths, min, max) {
    return Array.from({ length: numMonths }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

const JobCardsResolvedChart = () => {
    const raised = getRandomCounts(12, 10, 30);
    const resolved = getRandomCounts(12, 5, 28);

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Job Cards Raised',
                data: raised,
                backgroundColor: '#4285F4',
            },
            {
                label: 'Job Cards Resolved',
                data: resolved,
                backgroundColor: '#00C220',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false }, // Hide default legend
            title: { display: false },  // Hide default title
        },
        scales: {
            x: {
                stacked: false,
                barPercentage: 1,       // Make each bar take full width of its slot
                categoryPercentage: 1,  // Controls gap between month groups
            },
            y: { beginAtZero: true },
        },
    };

    // Custom legend items
    const legendItems = [
        { label: 'Job Cards Raised', color: '#4285F4' },
        { label: 'Job Cards Resolved', color: '#00C220' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ flex: 1, textAlign: 'left', color: '#4285F4', fontWeight: 600, fontSize: 18 }}>
                    Job Cards vs Job Cards Resolved
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {legendItems.map(item => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', fontWeight: 'base', color: '#00000096', fontSize: 14 }}>
                            <span style={{ display: 'inline-block', width: 16, height: 16, background: item.color, borderRadius: 4, marginRight: 8 }}></span>
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default JobCardsResolvedChart;
