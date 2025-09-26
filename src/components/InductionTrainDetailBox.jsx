import React from 'react';
import { AlertTriangle } from 'lucide-react';

function InductionTrainDetailBox({ train, idx }) {
    // Determine border color by criticality
    const hasCritical = train.violations && train.violations.some(v => v.toLowerCase().includes('critical') || v.toLowerCase().includes('safety'));
    const borderColor = hasCritical ? 'border-red-500' : train.score >= 80 ? 'border-green-400' : train.score >= 60 ? 'border-yellow-400' : 'border-gray-300';
    return (
        <div className={`w-full flex flex-col p-3 sm:p-4 rounded-lg border-2 ${borderColor} bg-white shadow-sm`}>
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-mono font-bold text-base sm:text-lg text-gray-700">{idx + 1}.</span>
                    <span className="font-mono font-semibold text-[#4285F4] text-base sm:text-lg">{train.train}</span>
                    <span className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm text-gray-600 font-semibold">Score:</span>
                        <span className={`font-bold text-xs sm:text-sm px-3 sm:px-4 py-0.5 sm:py-1 rounded-full border ${train.score >= 80 ? 'bg-green-50 border-green-400 text-green-700' : train.score >= 60 ? 'bg-yellow-50 border-yellow-400 text-yellow-700' : 'bg-red-50 border-red-400 text-red-700'}`}>{train.score}</span>
                    </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Stabling Bay: <span className="font-mono">{idx + 1}</span></div>
            </div>
            <div className="mb-2 text-xs sm:text-sm text-[#0000008A] font-semibold">
                {(() => {
                    if (!train.explanation) return null;
                    let explanationText = '';
                    try {
                        // Try to parse as JSON if it looks like an object
                        const parsed = typeof train.explanation === 'string' ? JSON.parse(train.explanation) : train.explanation;
                        explanationText = parsed.Explanation || JSON.stringify(parsed);
                    } catch {
                        // Fallback: show as plain string
                        explanationText = train.explanation;
                    }
                    return explanationText;
                })()}
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                    <div className="font-semibold text-[#4285F4] text-xs sm:text-sm mb-1">Critical Issues</div>
                    {train.violations && train.violations.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {train.violations.map((v, i) => (
                                <span key={i} className="flex items-center gap-1 text-red-600 text-xs sm:text-sm"><AlertTriangle size={12} sm:size={14} />{v}</span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-green-600 text-xs sm:text-sm">None</span>
                    )}
                </div>
                <div>
                    <div className="font-semibold text-[#4285F4] text-xs sm:text-sm mb-1">Job Cards</div>
                    {train.jobCards?.all && train.jobCards.all.length > 0 ? (
                        <ul className="space-y-1">
                            {train.jobCards.all.map((jc, i) => (
                                <li key={i} className="text-xs sm:text-sm font-semibold text-[#0000008A]">
                                    <span className={`px-2 sm:px-2.5 py-0.5 rounded-full font-semibold mr-2 ${jc.priority === 'Critical' ? 'custom-red-low-text' : jc.priority === 'High' ? 'custom-yellow-low-text' : jc.priority === 'Medium' ? 'custom-yellow-low-text' : jc.priority === 'Low' ? 'custom-blue-low-text' : jc.priority === 'Info' ? 'custom-gray-low-text' : ''}`}>{jc.priority}</span>
                                    {jc.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className="text-gray-500 text-xs sm:text-sm">None</span>
                    )}
                </div>
                <div>
                    <div className="font-semibold text-[#4285F4] text-xs sm:text-sm mb-1">Fitness Certificates</div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">Stock: <span className="font-mono">{train.fitness?.stock || '-'}</span></div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">Signal: <span className="font-mono">{train.fitness?.signal || '-'}</span></div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">Telecom: <span className="font-mono">{train.fitness?.telecom || '-'}</span></div>
                </div>
                <div>
                    <div className="font-semibold text-[#4285F4] text-xs sm:text-sm mb-1">Branding</div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">Active: <span className="font-mono">{train.branding?.status ? 'Yes' : 'No'}</span></div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">Hours left: <span className="font-mono">{train.branding?.hoursRemaining ?? '-'}</span></div>
                </div>
                <div>
                    <div className="font-semibold text-[#4285F4] text-xs sm:text-sm mb-1">Mileage</div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">Odometer: <span className="font-mono">{train.mileage?.odometer?.toLocaleString() ?? '-'}</span></div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">Last Service: <span className="font-mono">{train.mileage?.lastService || '-'}</span></div>
                </div>
                <div>
                    <div className="font-semibold text-[#4285F4] text-xs sm:text-sm mb-1">Cleaning</div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0000008A]">{train.cleaningSlot ? 'Yes' : 'No'}</div>
                </div>
            </div>
        </div>
    );
}

export default InductionTrainDetailBox;
