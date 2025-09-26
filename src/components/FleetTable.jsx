import React, { useState } from 'react';
// Utility to convert ISO date string to status
function getCertificateStatus(dateString) {
    if (!dateString) return 'None';
    const certDate = new Date(dateString);
    if (isNaN(certDate)) return 'None';
    const now = new Date();
    // Normalize to local date (ignore time for 'ExpiresToday')
    const certYMD = certDate.getFullYear() + '-' + (certDate.getMonth() + 1) + '-' + certDate.getDate();
    const nowYMD = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    if (certDate < now) {
        // If expired and not today
        if (certYMD !== nowYMD) return 'Expired';
        // If expired but today
        return 'ExpiresToday';
    }
    if (certYMD === nowYMD) return 'ExpiresToday';
    return 'OK';
}
import { useTrainList } from '../context/TrainListContext';
import { useInductionList } from '../context/InductionListContext';
import '../custom-status-colors.css';
import { Search, AlertTriangle, PlusCircle } from 'lucide-react';
import OverrideModal from './OverrideModal';
import '../flicker.css';

function getColor(status) {
    // Custom color codes for boxes
    switch (status) {
        case 'OK':
            return 'custom-green-low';
        case 'None':
            return 'custom-gray-low';
        case 'ExpiresToday':
        case 'Medium':
        case 'High':
            return 'custom-yellow-low';
        case 'Expired':
        case 'Critical':
            return 'custom-red-low';
        case 'Low':
            return 'custom-blue-low';
        default:
            return 'custom-gray-low';
    }
}


function FleetTable({ onTrainSelect, showInductionList, setShowInductionList }) {
    const { trainList, setTrainList, loading, error } = useTrainList();
    const { setInductionList, setLoading } = useInductionList();
    const [searchTerm, setSearchTerm] = useState('');
    const [fitnessFilter, setFitnessFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrainId, setSelectedTrainId] = useState(null);

    const handleOverrideClick = (trainId, event) => {
        event.stopPropagation(); // Prevent row click from firing
        setSelectedTrainId(trainId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTrainId(null);
    };

    const handleSubmitOverride = (overrideValues) => {
        console.log('Override submitted for train:', selectedTrainId, overrideValues);
        setTrainList(prevTrains =>
            prevTrains.map(train =>
                train.id === selectedTrainId
                    ? { ...train, override: overrideValues }
                    : train
            )
        );
        handleCloseModal();
    };

    const handleGenerateOptimization = async () => {
        console.log("Generating optimization with current train data:", trainList);
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/optimizer/run/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trainList.map(train => ({
                    id: train.id,
                    depotId: train.depotId || "D1", // Assuming a default depotId if not present
                    certificates: train.fitness,
                    jobCards: { count: train.jobCards.count, all: train.jobCards.all },
                    mileage: train.mileage,
                    branding: train.branding,
                    cleaningSlot: train.cleaningSlot,
                    crew: train.crew,
                    override: train.override,
                }))),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const optimizerOutput = await response.json();
            console.log("Optimizer output:", optimizerOutput);

            // Process optimizerOutput for TrainListContext
            const updatedTrainList = trainList.map(train => {
                const optimizedTrainData = optimizerOutput.D1.trains.find(
                    optTrain => optTrain.trainId === train.id
                );
                if (optimizedTrainData) {
                    return {
                        ...train,
                        totalScore: optimizedTrainData.totalScore,
                        eligible: optimizedTrainData.eligible,
                        relativeScores: optimizedTrainData.relativeScores,
                        reason: optimizedTrainData.reason,
                        violations: optimizedTrainData.violations,
                        explanation: optimizedTrainData.explanation,
                    };
                }
                return train;
            });
            setTrainList(updatedTrainList);

            // Process optimizerOutput for InductionListContext
            const transformedInductionList = optimizerOutput.D1.trains.map(optTrain => {
                const originalTrainData = trainList.find(train => train.id === optTrain.trainId);
                return {
                    trainId: optTrain.trainId,
                    train: optTrain.trainId, // InductionListDetailed uses 'train' for trainId
                    score: optTrain.totalScore, // InductionListDetailed uses 'score' for totalScore
                    totalScore: optTrain.totalScore,
                    eligible: optTrain.eligible,
                    relativeScores: optTrain.relativeScores,
                    reason: optTrain.reason,
                    violations: optTrain.violations,
                    explanation: optTrain.explanation,
                    stablingBay: originalTrainData?.stablingBay || '-', // Get stablingBay from original trainList
                    jobCards: originalTrainData?.jobCards || {}, // Carry over jobCards from original trainList
                    branding: originalTrainData?.branding || {},
                    mileage: originalTrainData?.mileage || {},
                    cleaningSlot: originalTrainData?.cleaningSlot || false,
                    fitness: originalTrainData?.fitness || {},
                    crew: originalTrainData?.crew || {},
                    override: originalTrainData?.override || {},
                };
            }).sort((a, b) => b.score - a.score); // Sort by score descending
            setInductionList(transformedInductionList);
            setLoading(false);
        } catch (error) {
            console.error("Error running optimizer:", error);
            setLoading(false);
        }
    };

    const filteredTrains = Array.isArray(trainList) ? trainList.filter(train => {
        const matchesSearch = (train.id || train.train_id || '').toLowerCase().includes(searchTerm.toLowerCase());
        // Use computed status for filtering
        const stockStatus = getCertificateStatus(train.fitness?.stock);
        const signalStatus = getCertificateStatus(train.fitness?.signal);
        const telecomStatus = getCertificateStatus(train.fitness?.telecom);
        const matchesFitness = fitnessFilter === 'all' ||
            [stockStatus, signalStatus, telecomStatus].includes(fitnessFilter);
        const matchesSeverity = severityFilter === 'all' || (train.jobCards && train.jobCards.severity === severityFilter);
        return matchesSearch && matchesFitness && matchesSeverity;
    }) : [];

    if (loading) {
        return <div className="bg-white shadow rounded p-4 flex-1 flex items-center justify-center h-32">Loading...</div>;
    }
    if (error) {
        return <div className="bg-white shadow rounded p-4 flex-1 flex items-center justify-center h-32 text-red-600">Error loading train list</div>;
    }

    return (
        <div className="bg-white shadow rounded p-4 flex-1">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#4285F4]">Fleet Status Overview</h2>
                    <div className="flex items-center gap-2">
                        <span
                            className="px-3 py-2 rounded-full text-md font-semibold"
                            style={{ background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)', color: '#fff' }}
                        >
                            {filteredTrains.length + 1} trains
                        </span>
                        {showInductionList ? (
                            <button
                                onClick={() => setShowInductionList(false)}
                                className="px-3 py-2 rounded-full text-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                style={{ background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)', color: '#fff' }}
                            >
                                Hide Induction List
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowInductionList(true)}
                                className="px-3 py-2 rounded-full text-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                style={{ background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)', color: '#fff' }}
                            >
                                Show Induction List
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex gap-4 items-center mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            placeholder="Search train ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={fitnessFilter}
                        onChange={(e) => setFitnessFilter(e.target.value)}
                        className="w-40 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="OK">OK</option>
                        <option value="ExpiresToday">Expires Today</option>
                        <option value="Expired">Expired</option>
                    </select>
                    <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="w-40 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Severities</option>
                        <option value="None">None</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                    <button
                        onClick={handleGenerateOptimization}
                        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        style={{ background: 'linear-gradient(90deg, #16c784 0%, #11998e 100%)', color: '#fff' }}
                    >
                        Generate Optimization
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse text-center" style={{ color: '#0000008A', fontWeight: 600 }}>
                    <thead>
                        <tr style={{ background: '#D2E3FF' }} className="border-b border-gray-300">
                            <th className="p-3 font-medium" style={{ color: '#4285F4', borderRight: '1px solid #B6C6E6' }}>Train ID</th>
                            <th className="p-3 font-medium" style={{ color: '#4285F4', borderRight: '1px solid #B6C6E6', width: '90px' }}>Fitness Certificates</th>
                            <th className="p-3 font-medium" style={{ color: '#4285F4', borderRight: '1px solid #B6C6E6' }}>Job Cards</th>
                            <th className="p-3 font-medium" style={{ color: '#4285F4', borderRight: '1px solid #B6C6E6', width: '180px' }}>Mileage</th>
                            <th className="p-3 font-medium" style={{ color: '#4285F4', borderRight: '1px solid #B6C6E6' }}>Branding</th>
                            <th className="p-3 font-medium" style={{ color: '#4285F4', borderRight: '1px solid #B6C6E6' }}>Cleaning</th>

                            <th className="p-3 font-medium" style={{ color: '#4285F4' }}>Override</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrains.map((train) => (
                            <tr
                                key={train.id}
                                className="border-b border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors"
                                style={{ borderBottom: '1px solid #B6C6E6' }}
                                onClick={() => onTrainSelect(train.id)}
                            >
                                <td className="p-3 font-mono font-medium" style={{ borderRight: '1px solid #B6C6E6' }}>{train.id}</td>
                                <td className="p-3" style={{ borderRight: '1px solid #B6C6E6', width: '90px' }}>
                                    <div className="flex gap-1 justify-center">
                                        {/* Stock Certificate with Tooltip */}
                                        {(() => {
                                            const status = getCertificateStatus(train.fitness?.stock);
                                            const date = train.fitness?.stock;
                                            return (
                                                <span className={`relative group px-3 py-1 rounded-full text-xs ${getColor(status)}`}>
                                                    S
                                                    <div className="absolute left-1/2 z-20 top-full mt-2 w-48 -translate-x-1/2 bg-white border border-gray-300 rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 text-xs text-left whitespace-normal">
                                                        <div className="font-semibold text-[#4285F4] mb-1">Stock Certificate</div>
                                                        <div><span className="font-mono">{date || '-'}</span></div>
                                                        <div>Status: <span className="font-bold">{status}</span></div>
                                                    </div>
                                                </span>
                                            );
                                        })()}
                                        {/* Signal Certificate with Tooltip */}
                                        {(() => {
                                            const status = getCertificateStatus(train.fitness?.signal);
                                            const date = train.fitness?.signal;
                                            return (
                                                <span className={`relative group px-3 py-1 rounded-full text-xs ${getColor(status)}`}>
                                                    Si
                                                    <div className="absolute left-1/2 z-20 top-full mt-2 w-48 -translate-x-1/2 bg-white border border-gray-300 rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 text-xs text-left whitespace-normal">
                                                        <div className="font-semibold text-[#4285F4] mb-1">Signal Certificate</div>
                                                        <div><span className="font-mono">{date || '-'}</span></div>
                                                        <div>Status: <span className="font-bold">{status}</span></div>
                                                    </div>
                                                </span>
                                            );
                                        })()}
                                        {/* Telecom Certificate with Tooltip */}
                                        {(() => {
                                            const status = getCertificateStatus(train.fitness?.telecom);
                                            const date = train.fitness?.telecom;
                                            return (
                                                <span className={`relative group px-3 py-1 rounded-full text-xs ${getColor(status)}`}>
                                                    T
                                                    <div className="absolute left-1/2 z-20 top-full mt-2 w-48 -translate-x-1/2 bg-white border border-gray-300 rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 text-xs text-left whitespace-normal">
                                                        <div className="font-semibold text-[#4285F4] mb-1">Telecom Certificate</div>
                                                        <div><span className="font-mono">{date || '-'}</span></div>
                                                        <div>Status: <span className="font-bold">{status}</span></div>
                                                    </div>
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </td>
                                <td className="p-3" style={{ borderRight: '1px solid #B6C6E6', width: '180px' }}>
                                    <div className="flex items-center gap-2 group relative cursor-pointer">
                                        <span className="font-medium">{train.jobCards.count}</span>
                                        {['Low', 'Critical', 'Medium', 'High', 'OK', 'None', 'Expired', 'ExpiresToday'].includes(train.jobCards.severity) ? (
                                            <span className={`px-3 py-1 rounded-full text-xs ${train.jobCards.severity === 'Low' ? 'custom-blue-low-text' :
                                                train.jobCards.severity === 'Critical' ? 'custom-red-low-text' :
                                                    train.jobCards.severity === 'Medium' || train.jobCards.severity === 'High' || train.jobCards.severity === 'ExpiresToday' ? 'custom-yellow-low-text' :
                                                        train.jobCards.severity === 'OK' ? 'custom-green-low-text' :
                                                            train.jobCards.severity === 'None' ? 'custom-gray-low-text' :
                                                                train.jobCards.severity === 'Expired' ? 'custom-red-low-text' :
                                                                    ''
                                                }`}>{train.jobCards.severity}</span>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs ${getColor(train.jobCards.severity)}`}>{train.jobCards.severity}</span>
                                        )}
                                        {/* Tooltip for job cards */}
                                        {Array.isArray(train.jobCards.all) && train.jobCards.all.length > 0 && (
                                            <div className="absolute left-1/2 z-20 top-full mt-2 w-72 -translate-x-1/2 bg-white border border-gray-300 rounded shadow-lg p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 text-xs text-left">
                                                <div className="mb-2 font-semibold text-sm text-[#4285F4]">Job Cards ({train.jobCards.count})</div>
                                                <ul className="space-y-1">
                                                    {train.jobCards.all.map((jc, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className={`px-2 py-0.5 rounded-full font-semibold ${jc.priority === 'Critical' ? 'custom-red-low-text' :
                                                                jc.priority === 'High' ? 'custom-yellow-low-text' :
                                                                    jc.priority === 'Medium' ? 'custom-yellow-low-text' :
                                                                        jc.priority === 'Low' ? 'custom-blue-low-text' :
                                                                            jc.priority === 'Info' ? 'custom-gray-low-text' :
                                                                                ''
                                                                }`}>
                                                                {jc.priority}
                                                            </span>
                                                            <span className="flex-1">{jc.title}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3" style={{ borderRight: '1px solid #B6C6E6' }}>
                                    <div className="text-sm">
                                        <div>{train.mileage.odometer.toLocaleString()} km</div>
                                        <div className="text-gray-500">{train.mileage.lastService}</div>
                                    </div>
                                </td>
                                <td className="p-3" style={{ borderRight: '1px solid #B6C6E6' }}>
                                    <div className="text-sm">
                                        {train.branding.status ? (
                                            <span className="px-2 py-1 rounded-full custom-green-low-text">Active</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full custom-gray-low-text">Inactive</span>
                                        )}
                                        {train.branding.status && (
                                            <div className="text-gray-500 mt-1">
                                                {train.branding.hoursRemaining}h left
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3" style={{ borderRight: '1px solid #B6C6E6' }}>
                                    {train.cleaningSlot ? (
                                        <span className="px-2 py-1 rounded-full custom-blue-low-text">Yes</span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full custom-gray-low-text">No</span>
                                    )}
                                </td>
                                <td className="p-3 cursor-pointer hover:bg-gray-200" onClick={(event) => handleOverrideClick(train.id, event)}>
                                    {train.override.flag && (
                                        <span title="Override" className="inline-flex items-center justify-center">
                                            <AlertTriangle size={25} className="text-red-500 flicker" />
                                        </span>
                                    )}
                                    {!train.override.flag && (
                                        <span title="Add Override" className="inline-flex items-center justify-center">
                                            <PlusCircle size={25} className="text-green-500" />
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <OverrideModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitOverride}
                trainId={selectedTrainId}
            />
        </div>
    );
}

export default FleetTable;