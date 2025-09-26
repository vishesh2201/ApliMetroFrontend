
import React from 'react';
import { Pie } from 'react-chartjs-2';

const CustomLegend = ({ labels, colors }) => (
    <div className="flex items-center space-x-4 pl-16">
        {labels.map((label, i) => (
            <div key={label} className="flex items-center space-x-1">
                <span style={{ backgroundColor: colors[i], width: 14, height: 14, display: 'inline-block', borderRadius: 3, marginRight: 4 }}></span>
                <span className="text-sm text-[#474747] font-normal">{label}</span>
            </div>
        ))}
    </div>
);

const FleetUtilizationChart = ({ data }) => (
    <div className="mb-8">
        <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-[#6689FF]">Fleet Utilization</h2>
            <CustomLegend labels={data.labels} colors={data.datasets[0].backgroundColor} />
        </div>
        <div style={{ maxWidth: 400 }}>
            <Pie data={data} options={{ plugins: { legend: { display: false } } }} />
        </div>
    </div>
);

export default FleetUtilizationChart;
