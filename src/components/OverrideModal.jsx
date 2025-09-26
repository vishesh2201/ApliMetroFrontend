import React, { useState, useEffect } from 'react';

const overrideFlagOptions = [
    { value: 'No', label: 'No → no override' },
    { value: 'Yes', label: 'Yes → override applied' },
];

const overrideCategoryOptions = [
    { value: 'None', label: 'None (if no override)' },
    { value: 'Safety', label: 'Safety' },
    { value: 'Operational', label: 'Operational' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Branding', label: 'Branding' },
    { value: 'Cleaning', label: 'Cleaning' },
    { value: 'DataQuality', label: 'DataQuality' },
];

const overrideReasonMapping = {
    'Safety': [
        { value: 'Unexpected Fault Discovery', label: 'Unexpected Fault Discovery' },
        { value: 'Emergency Recall', label: 'Emergency Recall' },
        { value: 'Incident Response', label: 'Incident Response' },
    ],
    'Operational': [
        { value: 'Special Event Demand', label: 'Special Event Demand' },
        { value: 'Service Pattern Change', label: 'Service Pattern Change' },
        { value: 'Depot Logistics', label: 'Depot Logistics' },
    ],
    'Maintenance': [
        { value: 'Pre-Emptive Maintenance', label: 'Pre-Emptive Maintenance' },
        { value: 'Deferred Maintenance', label: 'Deferred Maintenance' },
        { value: 'Last-Minute Workshop Request', label: 'Last-Minute Workshop Request' },
    ],
    'Branding': [
        { value: 'High-Value Campaign', label: 'High-Value Campaign' },
        { value: 'Political/PR Sensitivity', label: 'Political/PR Sensitivity' },
    ],
    'Cleaning': [
        { value: 'VIP / Media Ride', label: 'VIP / Media Ride' },
        { value: 'Public Complaints', label: 'Public Complaints' },
    ],
    'DataQuality': [
        { value: 'Missing Data', label: 'Missing Data' },
        { value: 'Erroneous Flag', label: 'Erroneous Flag' },
    ],
    'None': [
        { value: 'None (if no override)', label: 'None (if no override)' },
    ],
};

const overrideByOptions = [
    { value: 'None', label: 'None (if no override)' },
    { value: 'Control Room', label: 'Control Room' },
    { value: 'Depot Supervisor', label: 'Depot Supervisor' },
    { value: 'Maintenance Chief', label: 'Maintenance Chief' },
    { value: 'Workshop Staff', label: 'Workshop Staff' },
    { value: 'Branding Manager', label: 'Branding Manager' },
    { value: 'Operations Manager', label: 'Operations Manager' },
    { value: 'IT Admin', label: 'IT Admin' },
];

function OverrideModal({ isOpen, onClose, onSubmit, trainId }) {
    const [overrideFlag, setOverrideFlag] = useState('No');
    const [overrideCategory, setOverrideCategory] = useState('None');
    const [overrideReason, setOverrideReason] = useState('None (if no override)');
    const [overrideBy, setOverrideBy] = useState('None');

    useEffect(() => {
        if (!isOpen) {
            // Reset states when modal closes
            setOverrideFlag('No');
            setOverrideCategory('None');
            setOverrideReason('None (if no override)');
            setOverrideBy('None');
        }
    }, [isOpen]);

    const handleFlagChange = (e) => {
        const value = e.target.value;
        setOverrideFlag(value);
        if (value === 'No') {
            setOverrideCategory('None');
            setOverrideReason('None (if no override)');
            setOverrideBy('None');
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setOverrideCategory(value);
        setOverrideReason(overrideReasonMapping[value]?.[0]?.value || 'None (if no override)');
    };

    const handleSubmit = () => {
        onSubmit({
            overrideFlag,
            overrideCategory,
            overrideReason,
            overrideBy,
        });
    };

    const currentReasonOptions = overrideReasonMapping[overrideCategory] || [{ value: 'None (if no override)', label: 'None (if no override)' }];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-none">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-[#B6C6E6] relative">
                <div className="rounded-t-xl px-6 py-4" style={{ background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)' }}>
                    <h3 className="text-lg font-semibold text-white">Override for Train {trainId}</h3>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label htmlFor="override-flag" className="block text-sm font-semibold text-[#4285F4] mb-1">Override Flag</label>
                        <select
                            id="override-flag"
                            className="block w-full px-3 py-2 border border-[#B6C6E6] rounded focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4] bg-white text-gray-800"
                            value={overrideFlag}
                            onChange={handleFlagChange}
                        >
                            {overrideFlagOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="override-category" className="block text-sm font-semibold text-[#4285F4] mb-1">Override Category</label>
                        <select
                            id="override-category"
                            className="block w-full px-3 py-2 border border-[#B6C6E6] rounded focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4] bg-white text-gray-800"
                            value={overrideCategory}
                            onChange={handleCategoryChange}
                            disabled={overrideFlag === 'No'}
                        >
                            {overrideCategoryOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="override-reason" className="block text-sm font-semibold text-[#4285F4] mb-1">Override Reason</label>
                        <select
                            id="override-reason"
                            className="block w-full px-3 py-2 border border-[#B6C6E6] rounded focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4] bg-white text-gray-800"
                            value={overrideReason}
                            onChange={(e) => setOverrideReason(e.target.value)}
                            disabled={overrideFlag === 'No' || overrideCategory === 'None'}
                        >
                            {currentReasonOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="override-by" className="block text-sm font-semibold text-[#4285F4] mb-1">Override By</label>
                        <select
                            id="override-by"
                            className="block w-full px-3 py-2 border border-[#B6C6E6] rounded focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4] bg-white text-gray-800"
                            value={overrideBy}
                            onChange={(e) => setOverrideBy(e.target.value)}
                            disabled={overrideFlag === 'No'}
                        >
                            {overrideByOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            className="px-4 py-2 rounded font-semibold text-white"
                            style={{ background: 'linear-gradient(90deg, #FF3B3B 0%, #FF7B7B 100%)' }}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded font-semibold text-white"
                            style={{ background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)' }}
                            onClick={handleSubmit}
                        >
                            Submit Override
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default OverrideModal;
