import React from 'react';
import { useInductionList } from '../context/InductionListContext';
import InductionTrainDetailBox from './InductionTrainDetailBox';

function InductionListDetailed() {
    const { inductionList: trains, loading, error } = useInductionList();

    if (loading) {
        return <div className="w-full max-w-full p-2 sm:p-4 lg:p-6 flex items-center justify-center h-32">Loading...</div>;
    }
    if (error) {
        return <div className="w-full max-w-full p-2 sm:p-4 lg:p-6 flex items-center justify-center h-32 text-red-600">Error loading induction list</div>;
    }
    return (
        <div className="w-full p-2 sm:p-4 lg:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#4285F4] mb-4 px-2 sm:px-4">Induction Priority List (Detailed)</h2>
            <div className="w-full space-y-4 px-2 sm:px-4">
                {trains.map((train, idx) => (
                    <InductionTrainDetailBox key={train.trainId} train={train} idx={idx} />
                ))}
            </div>
        </div>
    );
}

export default InductionListDetailed;