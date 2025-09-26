import React from 'react';
import { Bar } from 'react-chartjs-2';

const JobCardSeverityChart = ({ data }) => (
    <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-[#6689FF]">Job Card Severity</h2>
        <div style={{ maxWidth: 600 }}>
            <Bar
                data={data}
                options={{
                    indexAxis: 'x',
                    plugins: { legend: { display: false } },
                    barThickness: 24,
                }}
            />
        </div>
    </div>
);

export default JobCardSeverityChart;
