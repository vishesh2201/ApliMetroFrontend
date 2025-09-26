
import React, { useState } from 'react';
import Lottie from 'lottie-react';
import trainLottie from '../assets/RP_Train_1.json';

import InductionTrainDetailBox from './InductionTrainDetailBox';

function WhatIfSimulation() {
    // 25 options: KM001, KM002, ..., KM025
    const options = Array.from({ length: 25 }, (_, i) => `KM${(i + 1).toString().padStart(3, '0')}`);
    const [inputs, setInputs] = useState([
        { selected: options[0], scenario: '' }
    ]);
    const [output, setOutput] = useState('');
    const [hasRun, setHasRun] = useState(false);


    const handleInputChange = (idx, field, value) => {
        setInputs(prev => prev.map((inp, i) => i === idx ? { ...inp, [field]: value } : inp));
    };

    const handleAddInput = () => {
        setInputs(prev => [...prev, { selected: options[0], scenario: '' }]);
    };

    const handleRemoveInput = (idx) => {
        setInputs(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
    };


    const handleRun = async () => {
        setOutput('Fetching latest train data...');
        setHasRun(true);
        let fleetData = [];
        try {
            const res = await fetch('http://localhost:8000/api/trains');
            if (!res.ok) throw new Error('Could not fetch train data');
            fleetData = await res.json();
        } catch (err) {
            setOutput('Error fetching train data: ' + err.message);
            return;
        }
        // Build payload: [{ train_id, scenario, train_data }]
        const payload = inputs.map(inp => {
            const train = fleetData.find(t => (t.id || '').toUpperCase() === inp.selected.toUpperCase());
            return {
                train_id: inp.selected,
                scenario: inp.scenario,
                train_data: train || null
            };
        });
        setOutput('Running simulation...');
        try {
            const res = await fetch('http://localhost:8000/whatIf/run/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Backend error');
            const result = await res.json();
            setOutput(result);
        } catch (err) {
            setOutput('Simulation failed: ' + err.message);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 gap-4 bg-gray-50">
            {/* Input Card */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-center items-center flex-1 min-h-[40vh] relative">
                {/* Top-left Title */}
                <div className="absolute top-4 left-6">
                    <div className="text-[#4285F4] font-semibold text-lg">
                        What-If Simulation
                    </div>
                    <div className="text-[#0000008A] text-sm font-semibold">
                        Choose the trains and type any scenario
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-2xl mt-10" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {inputs.map((inp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <select
                                className="p-2 border border-[#4285F4] rounded-full text-[#4285F4]"
                                value={inp.selected}
                                onChange={e => handleInputChange(idx, 'selected', e.target.value)}
                            >
                                {options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="p-2 border border-[#4285F4] rounded-full w-64 text-[#000000]"
                                placeholder="Type your scenario..."
                                value={inp.scenario}
                                onChange={e => handleInputChange(idx, 'scenario', e.target.value)}
                            />
                            {inputs.length > 1 && (
                                <button
                                    type="button"
                                    className="ml-2 p-0 border-none outline-none focus:outline-none"
                                    style={{ background: 'none', boxShadow: 'none', cursor: 'pointer' }}
                                    onClick={() => handleRemoveInput(idx)}
                                    aria-label="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path fill="#e53935" d="M7 21q-.825 0-1.413-.588Q5 19.825 5 19V7H4V5h5V4h6v1h5v2h-1v12q0 .825-.587 1.412Q17.825 21 17 21Zm10-14H7v12q0 .425.288.712Q7.575 20 8 20h8q.425 0 .713-.288Q17 19.425 17 19ZM9 18h2v-8H9Zm4 0h2v-8h-2Z" />
                                    </svg>
                                </button>
                            )}
                            {/* Add Train button to the right of the last input row only */}
                            {idx === inputs.length - 1 && (
                                <button
                                    className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                    onClick={handleAddInput}
                                    style={{ backgroundColor: '#d1fae5' }}
                                >+ Add Train</button>
                            )}
                        </div>
                    ))}
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 self-end"
                        onClick={handleRun}
                        style={{ background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)', color: '#fff' }}
                    >
                        Run Simulation
                    </button>
                </div>
            </div>
            {/* Output Card */}
            <div className="bg-white rounded-lg shadow p-6 flex-1 min-h-[40vh] flex flex-col overflow-y-auto max-h-[60vh] relative">
                <div className="absolute top-4 left-6">
                    <span className="font-semibold text-lg" style={{ color: '#4285F4' }}>Output</span>
                </div>
                <div className="pt-8">
                    {hasRun ? (
                        typeof output === 'string' && output.toLowerCase().includes('running simulation') ? (
                            <div className="flex flex-col items-center justify-center w-full h-full min-h-[30vh]">
                                <div className="w-48 h-48">
                                    <Lottie animationData={trainLottie} loop={true} />
                                </div>
                                <div className="mt-4 text-[#4285F4] text-lg font-semibold animate-pulse">running simulation...</div>
                            </div>
                        ) : (
                            <div className="w-full space-y-4 px-2 sm:px-4">
                                {Array.isArray(output) && output.length > 0 ? output.map((train, idx) => {
                                    // Map simulation output to InductionTrainDetailBox props
                                    const mappedTrain = {
                                        train: train.updated_train.id,
                                        score: train.score.totalScore,
                                        violations: train.score.violations,
                                        jobCards: train.updated_train.jobCards,
                                        fitness: train.updated_train.certificates,
                                        branding: train.updated_train.branding,
                                        mileage: train.updated_train.mileage,
                                        cleaningSlot: train.updated_train.cleaningSlot,
                                        explanation: train.explanation,
                                    };
                                    return (
                                        <InductionTrainDetailBox key={train.updated_train.id} train={mappedTrain} idx={idx} />
                                    );
                                }) : (
                                    <pre className="text-[#4285F4] text-lg font-medium whitespace-pre-wrap">No simulation results.</pre>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="text-gray-400 text-lg flex items-center justify-center w-full h-full min-h-[20vh]">Simulation output will appear here.</div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default WhatIfSimulation;
