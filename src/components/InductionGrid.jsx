import React from 'react';
import InductionTrainCard from './InductionTrainCard';

// Generate 25 mock trains named KM001 to KM025
function generateMockTrains() {
    return Array.from({ length: 25 }, (_, i) => ({
        trainId: `KM${String(i + 1).padStart(3, '0')}`,
        score: Math.floor(Math.random() * 100),
        assignedBay: null,
        violations: [],
        override: { flag: false },
    }));
}

// Assign trains to grid positions
function assignTrainsToGrid(trains) {
    const grid = {};
    let idx = 0;
    for (let track = 1; track <= 13; track++) {
        for (let pos = 1; pos <= 2; pos++) {
            if (idx < trains.length) {
                grid[`${track}_${pos}`] = { ...trains[idx], assignedBay: { track, position: pos } };
                idx++;
            } else {
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
    const trains = generateMockTrains();
    const grid = assignTrainsToGrid(trains);

    return (
        <div className="w-full h-[calc(100vh-64px)] overflow-auto p-4 flex flex-col gap-8">
            {/* IBL Section */}
            <div className="flex flex-col gap-2">
                <span className="text-base font-extrabold text-left" style={{ color: '#4285F4' }}>INSPECTION BAY LINE</span>
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
