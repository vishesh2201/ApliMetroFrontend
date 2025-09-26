import React from 'react';
import { Bar } from 'react-chartjs-2';

const DepotDistributionChart = ({ data }) => (
    <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-[#6689FF]">Depot/Line Distribution</h2>
        <div style={{ maxWidth: 800 }}>
            <Bar
                data={data}
                options={{
                    plugins: { legend: { display: false } },
                    barThickness: 24,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0,
                                stepSize: 1,
                                callback: function (value) { return Number.isInteger(value) ? value : null; }
                            }
                        }
                    }
                }}
            />
        </div>
    </div>
);

export default DepotDistributionChart;
