import React from 'react';

import { useInductionList } from '../context/InductionListContext';
import { AlertTriangle } from 'lucide-react';
import trainImage from '../assets/train.png'; // Import the train image

function getViolationSeverity(violations) {
    if (violations.some(v => v.includes('Safety') || v.includes('Critical'))) {
        return 'critical';
    }
    if (violations.length > 0) {
        return 'warning';
    }
    return 'none';
}

function InductionList() {
    const { inductionList: trains, loading, error } = useInductionList();


    if (loading) {
        return (
            <div className="w-96 bg-white shadow rounded-lg p-4 flex items-center justify-center h-32">
                <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #e0e0e0', borderTop: '4px solid #4285F4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
    if (error) {
        return <div className="w-96 bg-white shadow rounded-lg p-4 flex items-center justify-center h-32 text-red-600">Error loading induction list</div>;
    }
    return (
        <div className="bg-white shadow rounded-lg p-4 w-96">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-[#4285F4]">
                        Induction Priority List
                    </h2>
                    <span
                        className="px-3 py-2 rounded-full text-md font-semibold"
                        style={{
                            background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)',
                            color: '#fff',
                        }}
                    >
                        {trains.length} trains
                    </span>
                </div>

            </div>

            <div className="space-y-4 relative">
                {/* vertical "track" line */}

                {trains.map((train, index) => {
                    const violationSeverity = getViolationSeverity(train.violations);

                    const borderColor =
                        violationSeverity === 'critical'
                            ? 'border-red-500'
                            : violationSeverity === 'warning'
                                ? 'border-yellow-500'
                                : 'border-gray-300';

                    return (
                        <div
                            key={train.trainId}
                            className={`relative flex items-center justify-between p-3 border-t ${borderColor} bg-transparent transition`}
                        >
                            <div className="relative w-full h-28 overflow-hidden rounded-lg">
                                <img
                                    src={trainImage}
                                    alt="Train"
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    style={{ zIndex: 0 }}
                                />
                                {/* Overlay content: 2 columns */}
                                <div className="absolute top-3 left-3 flex flex-row w-[90%] justify-between z-10">
                                    {/* Left: trainId and score */}
                                    <div className="flex flex-col items-start">
                                        <span className="font-mono font-medium text-[#4285F4] text-base">{train.trainId}</span>
                                        <span className="flex items-center gap-1 mt-1">
                                            <span className="text-xs text-[#0000008A] font-semibold">Score:</span>
                                            <span
                                                className={`font-bold text-lg px-4 py-1 rounded-lg border ${train.score > 0
                                                    ? 'bg-green-50 border-green-400 text-green-700'
                                                    : 'bg-red-50 border-red-400 text-red-700'
                                                    }`}
                                            >
                                                {train.score}
                                            </span>
                                        </span>
                                    </div>
                                    {/* Right: override and violations, moved lower and left */}
                                    <div className="flex flex-col items-start mt-4 pr-16">
                                        {train.override.flag ? (
                                            <span className="px-1 py-0.5 rounded bg-red-500 text-white text-xs mb-1">
                                                Override Applied
                                            </span>
                                        ) : (
                                            <span className="px-1 py-0.5 rounded bg-green-500 text-white text-xs mb-1">
                                                No overrides
                                            </span>
                                        )}
                                        {train.violations.length > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <AlertTriangle size={10} className="text-yellow-600" />
                                                <span className="text-xs text-yellow-600">
                                                    {train.violations.length}{' '}
                                                    {train.violations.length > 1
                                                        ? 'violations'
                                                        : 'violation'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-green-700 bg-green-50 border border-green-400 rounded px-2 py-0.5">0 violations</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {trains.length === 0 && (
                    <div className="text-center py-8 text-gray-600">
                        <p>No trains in induction list</p>
                        <p className="text-sm">
                            Run simulation to generate recommendations
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InductionList;
