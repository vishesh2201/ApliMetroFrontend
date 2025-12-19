import React from 'react';
import InductionTrainCard from './InductionTrainCard';
import { useTrainList } from '../context/TrainListContext';

// Assign trains to grid positions using assignedBay from optimizer output
function assignTrainsToGrid(trains) {
    const grid = {};
    // Fill grid by assignedBay if present
    trains.forEach(train => {
        if (train.assignedBay && train.assignedBay.track && train.assignedBay.position) {
            grid[`${train.assignedBay.track}_${train.assignedBay.position}`] = train;
        }
    });
    // Fill empty slots with null
    for (let track = 1; track <= 13; track++) {
        for (let pos = 1; pos <= 2; pos++) {
            if (!grid[`${track}_${pos}`]) {
                grid[`${track}_${pos}`] = null;
            }
        }
    }
    return grid;
}

const getTypeLabel = (track, pos) => {
    if (track >= 1 && track <= 3) return 'IBL';
    if (track >= 4 && track <= 5) return 'CLEANING';
    if (track >= 6 && track <= 13) return pos === 1 ? 'REVENUE' : 'STANDBY';
    return '';
};

function InductionGrid() {
    const { trainList } = useTrainList();
    const grid = assignTrainsToGrid(trainList);

    // Handler for sending induction email
    const handleSendEmail = async () => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        try {
            const response = await fetch(`${API_URL}/webhook-test/d49a6911-2574-400b-ac3b-e13eca8e3f8d`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trigger: 'send_email' }),
            });
            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                alert('Failed to send email.');
            }
        } catch (error) {
            alert('Error sending email.');
        }
    };

    return (
        <div className="w-full h-[calc(100vh-64px)] overflow-auto p-4 flex flex-col gap-8">
            {/* IBL Section */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between">
                    <span className="text-base font-extrabold text-left" style={{ color: '#4285F4' }}>INSPECTION BAY LINE</span>
                    <button
                        onClick={handleSendEmail}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded shadow text-xs"
                        style={{ marginLeft: '16px' }}
                    >
                        Send Induction Email
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {[1, 2, 3].map(track => (
                        <div key={`IBL_ROW_${track}`} className="flex flex-row items-center gap-4">
                            <span className="text-xs font-bold mb-1 min-w-[120px]">Track {track}</span>
                            <div className="relative flex items-center min-w-[350px]" style={{ minHeight: '56px' }}>
                                <div className="absolute left-0 right-0 top-1/2 h-2 bg-[#bdbdbd] opacity-40 rounded-full z-0" style={{ transform: 'translateY(-50%)' }}></div>
                                <div className="relative z-10 w-full">
                                    <InductionTrainCard train={grid[`${track}_1`]} />
                                </div>
                            </div>
                            <span className="text-xs font-bold mb-1 min-w-[120px]">Track {track}</span>
                            <div className="relative flex items-center min-w-[350px]" style={{ minHeight: '56px' }}>
                                <div className="absolute left-0 right-0 top-1/2 h-2 bg-[#bdbdbd] opacity-40 rounded-full z-0" style={{ transform: 'translateY(-50%)' }}></div>
                                <div className="relative z-10 w-full">
                                    <InductionTrainCard train={grid[`${track}_2`]} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Cleaning Section */}
            <div className="flex flex-col gap-2">
                <span className="text-base font-extrabold text-left" style={{ color: '#4285F4' }}>CLEANING BAY LINE</span>
                <div className="flex flex-col gap-2">
                    {[4, 5].map(track => (
                        <div key={`CLEAN_ROW_${track}`} className="flex flex-row items-center gap-4">
                            <span className="text-xs font-bold mb-1 min-w-[120px]">Track {track}</span>
                            <div className="relative flex items-center min-w-[350px]" style={{ minHeight: '56px' }}>
                                <div className="absolute left-0 right-0 top-1/2 h-2 bg-[#bdbdbd] opacity-40 rounded-full z-0" style={{ transform: 'translateY(-50%)' }}></div>
                                <div className="relative z-10 w-full">
                                    <InductionTrainCard train={grid[`${track}_1`]} />
                                </div>
                            </div>
                            <span className="text-xs font-bold mb-1 min-w-[120px]">Track {track}</span>
                            <div className="relative flex items-center min-w-[350px]" style={{ minHeight: '56px' }}>
                                <div className="absolute left-0 right-0 top-1/2 h-2 bg-[#bdbdbd] opacity-40 rounded-full z-0" style={{ transform: 'translateY(-50%)' }}></div>
                                <div className="relative z-10 w-full">
                                    <InductionTrainCard train={grid[`${track}_2`]} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Revenue/Standby Section */}
            <div className="flex flex-col gap-2">
                <span className="text-base font-extrabold text-left" style={{ color: '#4285F4' }}>REVENUE BAY LINE</span>
                <div className="flex flex-col gap-2">
                    {[6, 7, 8, 9, 10, 11, 12, 13].map(track => (
                        <div key={`REV_ROW_${track}`} className="flex flex-row items-center gap-4">
                            <span className="text-xs font-bold mb-1 min-w-[120px]">Track {track}</span>
                            <div className="relative flex items-center min-w-[350px]" style={{ minHeight: '56px' }}>
                                <div className="absolute left-0 right-0 top-1/2 h-2 bg-[#bdbdbd] opacity-40 rounded-full z-0" style={{ transform: 'translateY(-50%)' }}></div>
                                <div className="relative z-10 w-full">
                                    <InductionTrainCard train={grid[`${track}_1`]} />
                                </div>
                            </div>
                            <span className="text-xs font-bold mb-1 min-w-[120px]">Track {track}</span>
                            <div className="relative flex items-center min-w-[350px]" style={{ minHeight: '56px' }}>
                                <div className="absolute left-0 right-0 top-1/2 h-2 bg-[#bdbdbd] opacity-40 rounded-full z-0" style={{ transform: 'translateY(-50%)' }}></div>
                                <div className="relative z-10 w-full">
                                    <InductionTrainCard train={grid[`${track}_2`]} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InductionGrid;
