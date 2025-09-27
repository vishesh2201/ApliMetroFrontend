import React from 'react';
import InductionTrainCard from './InductionTrainCard';

function StandbyList({ trains }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-700 mb-2">Standby / Backup</h3>
            {trains.length === 0 ? (
                <div className="text-gray-500">No trains in standby.</div>
            ) : (
                <div className="space-y-2">
                    {trains.map(train => (
                        <InductionTrainCard key={train.trainId} train={train} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default StandbyList;
