import React, { useState } from 'react';
import WhatIfSimulation from './WhatIfSimulation';
import { Train, ClipboardList, Zap, BarChart3, Settings, LogOut } from 'lucide-react';

const menuItems = [
    { id: 'fleet', label: 'Fleet Status', icon: Train },
    { id: 'induction', label: 'Induction List', icon: ClipboardList },
    { id: 'simulation', label: 'What-If Simulation', icon: Zap },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
];

function Sidebar({ activeTab, onTabChange, onLogout }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {/* Hamburger menu for mobile */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {/* Sidebar overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-100 border-r border-gray-300 h-full flex-col z-50 
                            ${isSidebarOpen ? 'flex' : 'hidden'} lg:flex`}>
                <div className="p-6 border-b border-gray-300">
                    <div className="flex items-center space-x-2 text-blue-600">
                        <Train size={24} />
                        <div>
                            <h2 className="font-semibold">Kochi Metro</h2>
                            <p className="text-sm text-gray-500">Induction Planner</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`w-full text-left p-2 rounded flex items-center space-x-3`}
                                style={activeTab === item.id
                                    ? { background: 'linear-gradient(90deg, #4318FF 0%, #4285F4 100%)', color: 'white' }
                                    : { backgroundColor: 'transparent', color: 'black', border: 'none' }}
                                onClick={() => {
                                    onTabChange(item.id);
                                    setIsSidebarOpen(false); // Close sidebar on item click
                                }}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-300">
                    <button
                        className="w-full text-left p-2 rounded flex items-center space-x-3"
                        style={{ backgroundColor: 'transparent', color: '#dc2626', border: 'none' }} // Tailwind's red-600
                        onClick={onLogout}
                    >
                        <LogOut size={18} style={{ color: '#dc2626' }} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
            {/* What-If Simulation Page Overlay */}
            {activeTab === 'simulation' && (
                <div className="fixed inset-0 left-64 bg-white z-40 overflow-auto">
                    <WhatIfSimulation />
                </div>
            )}
        </>
    );
}

export default Sidebar;