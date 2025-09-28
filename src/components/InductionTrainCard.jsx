import React from 'react';
// Mapping for next steps based on taskFlow
const TASK_FLOW_NEXT_STEPS = {
    cleaning: "Ready for service - no next task",
    maintenance: "Ready for service - no next task",
    maintenance_and_cleaning: "Still needs cleaning - move to cleaning bay next",
    stabling_near_cleaning: "Wait for cleaning bay availability",
    stabling: "Wait for morning service",
    out_of_service_stabling: "Wait for maintenance/repair",
    no_bays_available: "Contact operations manager"
};
import trainImage from '../assets/train.png';
import { AlertTriangle } from 'lucide-react';

function getViolationSeverity(violations) {
    if (violations.some(v => v.includes('Safety') || v.includes('Critical'))) {
        return 'critical';
    }
    if (violations.length > 0) {
        return 'warning';
    }
    return 'none';
}

const InductionTrainCard = ({ train, selected, onClick }) => {
    if (!train) {
        // Render a blank placeholder for empty slots
        return <div className="h-28 mb-2 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">Empty</div>;
    }
    const violationSeverity = getViolationSeverity(train.violations || []);
    const borderColor =
        violationSeverity === 'critical'
            ? 'border-red-500'
            : violationSeverity === 'warning'
                ? 'border-yellow-500'
                : 'border-gray-300';
    const selectedStyle = selected ? 'ring-2 ring-blue-500 bg-blue-50' : '';

    return (
        <div
            className={`relative flex flex-col items-center p-3 border-t border-b ${borderColor} bg-white transition mb-2 cursor-pointer ${selectedStyle}`}
            onClick={() => onClick && onClick(train.id)}
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
                        <span className="font-mono font-medium text-[#4285F4] text-base">{train.id}</span>
                        <span className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-[#0000008A] font-semibold">Score:</span>
                            <span
                                className={`font-bold text-lg px-4 py-1 rounded-lg border ${train.score > 0
                                    ? 'bg-green-50 border-green-400 text-green-700'
                                    : 'bg-red-50 border-red-400 text-red-700'
                                    }`}
                            >
                                {train.score ?? train.totalScore}
                            </span>
                        </span>
                    </div>
                    {/* Right: override and violations, moved lower and left */}
                    <div className="flex flex-col items-start mt-4 pr-16">
                        {train.override?.flag ? (
                            <span className="px-1 py-0.5 rounded bg-red-500 text-white text-xs mb-1">
                                Override Applied
                            </span>
                        ) : (
                            <span className="px-1 py-0.5 rounded bg-green-500 text-white text-xs mb-1">
                                No overrides
                            </span>
                        )}
                        {train.violations?.length > 0 ? (
                            <div className="flex items-center gap-1">
                                <AlertTriangle size={10} className="text-yellow-600" />
                                <span className="text-xs text-yellow-600">
                                    {train.violations.length}{' '}
                                    {train.violations.length > 1 ? 'violations' : 'violation'}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-green-700 bg-green-50 border border-green-400 rounded px-2 py-0.5">0 violations</span>
                        )}
                    </div>
                </div>
            </div>
            {/* Task list and duration below train card */}
            {(train.taskFlow || train.taskDuration) && (
                <div className="w-full text-center mt-2">
                    {train.taskFlow && Array.isArray(train.taskFlow) && train.taskFlow.length > 0 && (
                        <div className="text-xs text-gray-700 font-semibold">
                            {train.taskFlow.map((task, idx) => (
                                <div key={idx}>
                                    {TASK_FLOW_NEXT_STEPS[task] || task}
                                </div>
                            ))}
                        </div>
                    )}
                    {train.taskDuration && (
                        <div className="text-xs text-gray-500">
                            Duration: {train.taskDuration}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InductionTrainCard;
